import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getVideos } from '../server/<wherever-your-code-is>'; // adjust import path

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  const videos = await getVideos();
  res.status(200).json(videos);
}
