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
      // Convert string parameters to proper types before validation
      const queryData = {
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        rows: req.query.rows ? parseInt(req.query.rows as string) : 50,
        durationMin: req.query.durationMin ? parseInt(req.query.durationMin as string) : undefined,
        durationMax: req.query.durationMax ? parseInt(req.query.durationMax as string) : undefined,
      };
      
      const filters = searchFiltersSchema.parse(queryData);
      
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
      // Use comma-separated fields instead of fl[] array
      searchUrl.searchParams.set("fl", "identifier,title,creator,year,mediatype,licenseurl,downloads,date,description,collection");
      searchUrl.searchParams.set("rows", filters.rows.toString());
      searchUrl.searchParams.set("page", filters.page.toString());
      searchUrl.searchParams.set("sort[]", filters.sort === 'downloads' ? 'downloads desc' : 
                                          filters.sort === 'date' ? 'date desc' : 'score desc');

      const response = await fetch(searchUrl.toString());
      
      if (!response.ok) {
        throw new Error(`Archive.org API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Log the first few docs for debugging
      console.log("Full API URL:", searchUrl.toString());
      console.log("Sample docs from Archive.org:", JSON.stringify(data.response?.docs?.slice(0, 1), null, 2));
      
      // Filter and enrich docs with proper video data
      const filteredDocs = (data.response?.docs || [])
        .filter((doc: any) => {
          // Must have identifier and title
          if (!doc.identifier || !doc.title) return false;
          
          // For development, be more permissive with licensing
          return true;
        })
        .map((doc: any) => ({
          identifier: doc.identifier,
          title: doc.title || 'Untitled',
          creator: doc.creator || 'Unknown',
          year: doc.year || doc.date?.substring(0, 4) || '',
          description: doc.description || '',
          duration: doc.duration || '',
          licenseurl: doc.licenseurl || '',
          downloads: parseInt(doc.downloads) || 0,
          date: doc.date || '',
          collection: Array.isArray(doc.collection) ? doc.collection.join(', ') : doc.collection || '',
          thumbnail: `https://archive.org/services/img/${doc.identifier}`,
        }));
      
      console.log(`Original docs count: ${data.response?.docs?.length}, Filtered count: ${filteredDocs.length}`);
      
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
      
      // Find best video file (prefer MP4, H.264, or any video format)
      const videoFiles = data.files?.filter((file: any) => 
        file.format === 'MPEG4' || 
        file.format === 'h.264' || 
        file.format === 'MPEG-4' ||
        file.format === 'QuickTime' ||
        file.name?.endsWith('.mp4') ||
        file.name?.endsWith('.mov') ||
        file.name?.endsWith('.avi') ||
        file.name?.match(/\.(mp4|mov|avi|mkv|webm)$/i)
      ) || [];
      
      // Sort by quality preference: full resolution first, then 512kb, then others
      const sortedVideoFiles = videoFiles.sort((a: any, b: any) => {
        const aName = a.name?.toLowerCase() || '';
        const bName = b.name?.toLowerCase() || '';
        
        // Prefer files without quality suffixes (original)
        const aHasQuality = aName.includes('_512kb') || aName.includes('_256kb') || aName.includes('_thumb');
        const bHasQuality = bName.includes('_512kb') || bName.includes('_256kb') || bName.includes('_thumb');
        
        if (!aHasQuality && bHasQuality) return -1;
        if (aHasQuality && !bHasQuality) return 1;
        
        // If both have quality indicators, prefer higher quality
        if (aName.includes('_512kb') && bName.includes('_256kb')) return -1;
        if (aName.includes('_256kb') && bName.includes('_512kb')) return 1;
        
        return 0;
      });
      
      const bestVideoFile = sortedVideoFiles[0];
      let streamUrl = null;
      
      if (bestVideoFile) {
        // Get the redirected URL from Archive.org
        const directUrl = `https://archive.org/download/${identifier}/${encodeURIComponent(bestVideoFile.name)}`;
        try {
          const headResponse = await fetch(directUrl, { method: 'HEAD' });
          if (headResponse.redirected) {
            streamUrl = headResponse.url;
            console.log(`🔗 Redirect resolved: ${directUrl} -> ${streamUrl}`);
          } else {
            streamUrl = directUrl;
          }
        } catch (redirectError) {
          console.warn('Failed to resolve redirect, using direct URL:', redirectError);
          streamUrl = directUrl;
        }
      }
      
      res.json({
        metadata: data.metadata,
        files: data.files,
        videoFile: bestVideoFile,
        videoFiles: sortedVideoFiles,
        streamUrl: streamUrl,
        detailsUrl: `https://archive.org/details/${identifier}`
      });
      
    } catch (error) {
      console.error("Metadata error:", error);
      res.status(500).json({ error: "Failed to get video metadata" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
