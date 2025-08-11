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
        sources: req.query.sources ? (req.query.sources as string).split(',') : undefined,
        allowRestrictedLicenses: req.query.allowRestrictedLicenses === 'true',
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
          case 'restricted':
            if (filters.allowRestrictedLicenses) {
              query += " AND (licenseurl:*nc* OR licenseurl:*nd* OR licenseurl:*sa*)";
            } else {
              // Default to safe licenses if restricted is selected but not allowed
              query += " AND (licenseurl:*publicdomain* OR licenseurl:*cc0* OR licenseurl:*by*)";
            }
            break;
        }
      }
      
      // Add source collection filters
      if (filters.sources && filters.sources.length > 0) {
        const sourceQueries = filters.sources.map((source: string) => {
          switch (source) {
            case 'prelinger':
              return 'collection:prelinger';
            case 'fedflix':
              return 'collection:fedflix';
            case 'nasa':
              return 'collection:nasa';
            case 'loc':
              return 'collection:library_of_congress';
            case 'wikimedia':
              return 'collection:wikimedia';
            default:
              return `collection:${source}`;
          }
        });
        query += ` AND (${sourceQueries.join(' OR ')})`;
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
  // Proxy video files through our server
  app.get("/api/video/:identifier/:filename", apiLimiter, async (req, res) => {
    try {
      const { identifier, filename } = req.params;
      const videoUrl = `https://archive.org/download/${identifier}/${decodeURIComponent(filename)}`;
      
      console.log(`🎥 Proxying video: ${videoUrl}`);
      
      const response = await fetch(videoUrl);
      if (!response.ok) {
        console.error(`❌ Video not found: ${videoUrl} (Status: ${response.status})`);
        return res.status(404).json({ 
          error: "Video file not found", 
          url: videoUrl, 
          status: response.status 
        });
      }
      
      // Set appropriate headers based on file extension
      const contentType = filename.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 
                         filename.toLowerCase().endsWith('.avi') ? 'video/x-msvideo' :
                         filename.toLowerCase().endsWith('.mov') ? 'video/quicktime' :
                         'video/mp4';
      
      res.set({
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
        'Content-Length': response.headers.get('content-length') || ''
      });
      
      // Stream the video through our server
      if (response.body) {
        const reader = response.body.getReader();
        
        const pump = async (): Promise<void> => {
          try {
            const { done, value } = await reader.read();
            if (done) {
              res.end();
              return;
            }
            res.write(Buffer.from(value));
            return pump();
          } catch (error) {
            console.error('Streaming error:', error);
            res.end();
          }
        };
        
        return pump();
      } else {
        res.status(500).json({ error: "No response body" });
      }
      
    } catch (error) {
      console.error(`❌ Video proxy error for ${req.params.identifier}/${req.params.filename}:`, error);
      res.status(500).json({ 
        error: "Failed to proxy video", 
        identifier: req.params.identifier,
        filename: req.params.filename,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/metadata/:identifier", apiLimiter, async (req, res) => {
    try {
      const { identifier } = req.params;
      
      const metadataUrl = `https://archive.org/metadata/${identifier}`;
      const response = await fetch(metadataUrl);
      
      if (!response.ok) {
        throw new Error(`Archive.org metadata API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Find only browser-compatible video files (MP4, WebM, MOV)
      const videoFiles = data.files?.filter((file: any) => 
        file.format === 'MPEG4' || 
        file.format === 'h.264' || 
        file.format === 'MPEG-4' ||
        file.name?.endsWith('.mp4') ||
        file.name?.endsWith('.webm') ||
        (file.name?.endsWith('.mov') && file.format !== 'JPEG')
      ) || [];
      
      console.log(`📁 Found ${videoFiles.length} browser-compatible video files for ${identifier}:`, 
        videoFiles.map((f: any) => `${f.name} (${f.format})`));
      
      // Sort by format compatibility and quality preference
      const sortedVideoFiles = videoFiles.sort((a: any, b: any) => {
        const aName = a.name?.toLowerCase() || '';
        const bName = b.name?.toLowerCase() || '';
        
        // Strongly prefer MP4 for best browser compatibility
        const aIsMp4 = aName.endsWith('.mp4') || a.format === 'MPEG4' || a.format === 'h.264';
        const bIsMp4 = bName.endsWith('.mp4') || b.format === 'MPEG4' || b.format === 'h.264';
        
        if (aIsMp4 && !bIsMp4) return -1;
        if (!aIsMp4 && bIsMp4) return 1;
        
        // Then prefer files without quality suffixes (original/full resolution)
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
        // Use our server as a proxy for video files to avoid CORS issues
        streamUrl = `/api/video/${identifier}/${encodeURIComponent(bestVideoFile.name)}`;
        console.log(`🎥 Selected best video: ${bestVideoFile.name} (format: ${bestVideoFile.format})`);
        console.log(`🎥 Using proxy URL: ${streamUrl}`);
      } else {
        console.warn(`⚠️ No browser-compatible video files found for ${identifier}`);
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
