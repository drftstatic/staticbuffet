import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

// Lightweight request logger. Kept here (not imported from ./vite) so this
// module can be bundled into a serverless function without pulling in Vite.
function log(message: string) {
  const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  console.log(`${time} [express] ${message}`);
}

function summarizeJsonResponse(value: unknown): string {
  if (Array.isArray(value)) {
    return `[array length=${value.length}]`;
  }

  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const details: string[] = [];

    for (const key of ["docs", "results", "items"]) {
      if (Array.isArray(record[key])) {
        details.push(`${key}=${record[key].length}`);
      }
    }

    for (const key of ["numFound", "total", "page"]) {
      if (typeof record[key] === "number") {
        details.push(`${key}=${record[key]}`);
      }
    }

    if ("error" in record || "message" in record) {
      details.push("error=true");
    }

    if (details.length > 0) {
      return `{ ${details.join(", ")} }`;
    }

    const keys = Object.keys(record);
    const suffix = keys.length > 5 ? ",…" : "";
    return keys.length > 0 ? `{ keys=${keys.slice(0, 5).join(",")}${suffix} }` : "{}";
  }

  return String(value);
}

// Builds the Express app with all API routes and middleware, but does NOT
// start listening. Shared by the local server entry (server/index.ts) and the
// Vercel serverless handler (api/index.ts).
export async function createApp() {
  const app = express();
  // Trust only the first proxy hop; 'true' would let clients spoof
  // X-Forwarded-For and bypass IP-based rate limiting.
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: unknown;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse !== undefined) {
          logLine += ` :: ${summarizeJsonResponse(capturedJsonResponse)}`;
        }
        if (logLine.length > 160) {
          logLine = logLine.slice(0, 159) + "…";
        }
        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(app);

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled request error:", err);

    if (res.headersSent) {
      next(err);
      return;
    }

    const error = err as { status?: unknown; statusCode?: unknown; message?: unknown };
    const statusCandidate = error.status ?? error.statusCode;
    const status = typeof statusCandidate === "number" && statusCandidate >= 400 && statusCandidate <= 599
      ? statusCandidate
      : 500;
    const message = typeof error.message === "string" ? error.message : "Internal Server Error";
    res.status(status).json({ message });
  });

  return app;
}
