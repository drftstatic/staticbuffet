import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

// Lightweight request logger. Kept here (not imported from ./vite) so this
// module can be bundled into a serverless function without pulling in Vite.
function log(message: string) {
  const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  console.log(`${time} [express] ${message}`);
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
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }
        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return app;
}
