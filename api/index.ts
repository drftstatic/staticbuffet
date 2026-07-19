import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../server/app";

// Vercel serverless entry. The whole Express app is mounted as a single
// function; vercel.json rewrites /api/* here. Build the app once and reuse it
// across warm invocations.
const appPromise = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await appPromise;
  return app(req, res);
}
