import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/app";

// Vercel serverless entry. The whole Express app is mounted as a single
// function; vercel.json rewrites /api/* here. Build the app once and reuse it
// across warm invocations.
const appPromise = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await appPromise;
  return (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(req, res);
}
