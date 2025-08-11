import type { Express } from "express";
import { createServer, type Server } from "http";
import { searchFiltersSchema } from "@shared/schema";
import rateLimit from "express-rate-limit";

// Rate limiter for Archive.org API calls
const apiLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10, // 10 requests per second
  message: { error: "Too many requests, please try again later" }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Search Archive.org with filters
  app.get("/api/search", apiLimiter, async (req, res) => {
    try {
      const filters = searchFiltersSchema.parse(req.query);
      
      // Build Archive.org search query
      let query = filters.query;
      
      // Add media type filter
      query += " AND mediatype:movies";
      
      // Add license filters
      if (filters.license !== 'all') {
        switch (filters.license) {
          case 'publicdomain':
            query += " AND (licenseurl:*publicdomain* OR collection:*publicdomain*)";
            break;
          case 'cc0':
            query += " AND licenseurl:*cc0*";
            break;
          case 'ccby':
            query += " AND licenseurl:*by*";
            break;
        }
      }
      
      // Add year range if specified
      if (filters.yearFrom || filters.yearTo) {
        const fromYear = filters.yearFrom || "1900";
        const toYear = filters.yearTo || new Date().getFullYear().toString();
        query += ` AND year:[${fromYear} TO ${toYear}]`;
      }
      
      // Build Archive.org API URL
      const searchUrl = new URL("https://archive.org/advancedsearch.php");
      searchUrl.searchParams.set("q", query);
      searchUrl.searchParams.set("output", "json");
      searchUrl.searchParams.set("fl[]", "identifier");
      searchUrl.searchParams.set("fl[]", "title");
      searchUrl.searchParams.set("fl[]", "creator");
      searchUrl.searchParams.set("fl[]", "year");
      searchUrl.searchParams.set("fl[]", "mediatype");
      searchUrl.searchParams.set("fl[]", "licenseurl");
      searchUrl.searchParams.set("fl[]", "downloads");
      searchUrl.searchParams.set("fl[]", "date");
      searchUrl.searchParams.set("fl[]", "description");
      searchUrl.searchParams.set("rows", filters.rows.toString());
      searchUrl.searchParams.set("page", filters.page.toString());
      searchUrl.searchParams.set("sort[]", filters.sort === 'downloads' ? 'downloads desc' : 
                                          filters.sort === 'date' ? 'date desc' : 'score desc');

      const response = await fetch(searchUrl.toString());
      
      if (!response.ok) {
        throw new Error(`Archive.org API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter results to only include videos with proper licensing
      const filteredDocs = data.response?.docs?.filter((doc: any) => {
        if (!doc.licenseurl && !doc.collection) return false;
        
        const license = (doc.licenseurl || '').toLowerCase();
        const collection = (doc.collection || '').toLowerCase();
        
        // Allow public domain, CC0, CC-BY but exclude NC/ND by default
        return license.includes('publicdomain') || 
               license.includes('cc0') || 
               (license.includes('by') && !license.includes('nc') && !license.includes('nd')) ||
               collection.includes('publicdomain');
      }) || [];
      
      res.json({
        ...data.response,
        docs: filteredDocs
      });
      
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to search videos" });
    }
  });

  // Get metadata for specific video
  app.get("/api/metadata/:identifier", apiLimiter, async (req, res) => {
    try {
      const { identifier } = req.params;
      
      const metadataUrl = `https://archive.org/metadata/${identifier}`;
      const response = await fetch(metadataUrl);
      
      if (!response.ok) {
        throw new Error(`Archive.org metadata API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Find best video file (prefer MP4 H.264)
      const videoFiles = data.files?.filter((file: any) => 
        file.format === 'MPEG4' || file.format === 'h.264' || file.name?.endsWith('.mp4')
      ) || [];
      
      const bestFile = videoFiles.find((file: any) => file.format === 'h.264') || 
                      videoFiles.find((file: any) => file.format === 'MPEG4') || 
                      videoFiles[0];
      
      res.json({
        metadata: data.metadata,
        files: data.files,
        videoFile: bestFile,
        streamUrl: bestFile ? `https://archive.org/download/${identifier}/${bestFile.name}` : null
      });
      
    } catch (error) {
      console.error("Metadata error:", error);
      res.status(500).json({ error: "Failed to get video metadata" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
