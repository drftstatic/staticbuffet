import type { Express } from "express";
import { createServer, type Server } from "http";
import { searchFiltersSchema } from "@shared/schema";
import rateLimit from "express-rate-limit";
import { metadataService } from "./metadata-service";
import { transcodeService } from "./transcode-service";
// import { CacheService } from "./cache-service";
import { promises as fs } from 'fs';
import path from 'path';

// Rate limiter for Archive.org API calls - more generous limits
const apiLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 20, // 20 requests per second (increased from 10)
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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
      
      // Check cache first
      // const cachedResults = CacheService.getCachedSearchResults(filters);
      // if (cachedResults) {
      //   return res.json(cachedResults);
      // }
      
      // Build Archive.org search query with better sanitization
      let query = filters.query.trim();
      
      // Remove potentially problematic characters and escape quotes
      query = query.replace(/[^\w\s\-'"]/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Ensure we have a valid query after sanitization
      if (!query) {
        throw new Error('Search query became empty after sanitization');
      }
      
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
      
      // Build Archive.org API URL with better validation
      const searchUrl = new URL("https://archive.org/advancedsearch.php");
      
      searchUrl.searchParams.set("q", query);
      searchUrl.searchParams.set("output", "json");
      
      // Use comma-separated fields instead of fl[] array
      searchUrl.searchParams.set("fl", "identifier,title,creator,year,mediatype,licenseurl,downloads,date,description,collection");
      
      // Validate and set pagination parameters with optimization
      const safeRows = Math.min(Math.max(1, filters.rows), 50); // Reduced from 100 to 50 for faster responses
      const safePage = Math.max(1, filters.page);
      searchUrl.searchParams.set("rows", safeRows.toString());
      searchUrl.searchParams.set("page", safePage.toString());
      
      // Add cursor-based pagination hint for better performance
      if (safePage > 1) {
        const cursorHint = (safePage - 1) * safeRows;
        searchUrl.searchParams.set("start", cursorHint.toString());
      }
      
      // Archive.org API sort parameter fix - use simple field names
      if (filters.sort === 'downloads') {
        searchUrl.searchParams.set("sort[]", 'downloads desc');
      } else if (filters.sort === 'date') {
        searchUrl.searchParams.set("sort[]", 'date desc');
      }
      // Don't set sort parameter for relevance/score - let Archive.org use default relevance

      // Retry logic for Archive.org API calls
      let lastError;
      let data;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔍 Search attempt ${attempt}/3 for query: "${filters.query}"`);
          console.log(`📡 API URL: ${searchUrl.toString()}`);
          
          const response = await fetch(searchUrl.toString(), {
            headers: {
              'User-Agent': 'VideoArchive/1.0 (+https://staticbuffet.tv)',
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Archive.org API error: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`Archive.org API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
          }
          
          const responseText = await response.text();
          console.log(`📥 Raw response: ${responseText.substring(0, 500)}...`);
          
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error(`❌ JSON parse error:`, parseError);
            throw new Error(`Invalid JSON response from Archive.org API: ${parseError instanceof Error ? parseError.message : parseError}`);
          }
          
          // Check if we got valid data
          if (!data.response) {
            console.error(`❌ Invalid response structure:`, data);
            throw new Error('Invalid response structure from Archive.org API');
          }
          
          console.log(`✅ Search successful on attempt ${attempt}, found ${data.response.numFound || 0} results`);
          break; // Success, exit retry loop
          
        } catch (error) {
          lastError = error;
          console.error(`Search attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
          
          if (attempt < 3) {
            // Wait before retrying (exponential backoff)
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      if (!data) {
        throw new Error(`Search failed after 3 attempts. Last error: ${lastError instanceof Error ? lastError.message : lastError}`);
      }
      
      // Log the first few docs for debugging
      console.log("Full API URL:", searchUrl.toString());
      console.log("Sample docs from Archive.org:", JSON.stringify(data.response?.docs?.slice(0, 1), null, 2));
      
      // Filter and enrich docs with proper video data
      const filteredDocs = (data.response?.docs || [])
        .filter((doc: any) => {
          // Must have identifier and title
          if (!doc.identifier || !doc.title) return false;
          
          // Filter out obvious non-video content by title/collection
          const title = (doc.title || '').toLowerCase();
          const collection = Array.isArray(doc.collection) ? doc.collection.join(' ').toLowerCase() : (doc.collection || '').toLowerCase();
          
          // Skip if title suggests it's not a video
          const nonVideoTerms = ['book', 'text', 'pdf', 'document', 'article', 'paper', 'audio only', 'soundtrack'];
          if (nonVideoTerms.some(term => title.includes(term) && !title.includes('video'))) {
            return false;
          }
          
          // Skip obvious data/software collections
          const dataCollections = ['software', 'data', 'texts', 'books', 'academic'];
          if (dataCollections.some(term => collection.includes(term))) {
            return false;
          }
          
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
      
      const result = {
        ...data.response,
        docs: filteredDocs
      };
      
      // Cache the successful result
      // CacheService.cacheSearchResults(filters, result, 30); // Cache for 30 minutes
      
      res.json(result);
      
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to search videos" });
    }
  });

  // Get metadata for specific video
  // Proxy video files through our server with Range support
  app.get("/api/video/:identifier/:filename", apiLimiter, async (req, res) => {
    try {
      const { identifier, filename } = req.params;
      const videoUrl = `https://archive.org/download/${identifier}/${decodeURIComponent(filename)}`;
      
      // Parse Range header if present
      const range = req.headers.range;
      const headers: Record<string, string> = {
        'User-Agent': 'StaticBuffet/1.0 (+https://staticbuffet.tv)',
        'Accept': '*/*',
      };
      
      // Forward range header to upstream
      if (range) {
        headers['Range'] = range;
        console.log(`🎥 Proxying video with range: ${videoUrl} [${range}]`);
      } else {
        console.log(`🎥 Proxying full video: ${videoUrl}`);
      }
      
      // Fetch with retry logic
      let response: Response | null = null;
      let lastError: Error | null = null;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          response = await fetch(videoUrl, { headers });
          
          if (response.ok || response.status === 206) {
            break; // Success
          }
          
          if (response.status === 404) {
            console.error(`❌ Video not found: ${videoUrl}`);
            return res.status(404).json({ 
              error: "Video file not found", 
              url: videoUrl, 
              status: response.status 
            });
          }
          
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          
        } catch (error) {
          lastError = error as Error;
          console.warn(`⚠️ Attempt ${attempt}/${maxRetries} failed:`, error);
          
          if (attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      if (!response || (!response.ok && response.status !== 206)) {
        throw lastError || new Error('Failed to fetch video after retries');
      }
      
      // Determine content type
      const contentType = filename.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 
                         filename.toLowerCase().endsWith('.webm') ? 'video/webm' :
                         filename.toLowerCase().endsWith('.ogv') ? 'video/ogg' :
                         filename.toLowerCase().endsWith('.avi') ? 'video/x-msvideo' :
                         filename.toLowerCase().endsWith('.mov') ? 'video/quicktime' :
                         'video/mp4';
      
      // Handle partial content response
      if (response.status === 206) {
        // Forward all relevant headers for partial content with optimizations
        const responseHeaders: Record<string, string> = {
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, immutable', // 24 hour cache for better performance
          'Connection': 'keep-alive',
          'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges'
        };
        
        // Forward range-related headers
        const contentRange = response.headers.get('content-range');
        const contentLength = response.headers.get('content-length');
        
        if (contentRange) responseHeaders['Content-Range'] = contentRange;
        if (contentLength) responseHeaders['Content-Length'] = contentLength;
        
        res.status(206).set(responseHeaders);
        
      } else {
        // Full content response with optimizations
        res.set({
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, immutable', // 24 hour cache
          'Connection': 'keep-alive',
          'Content-Length': response.headers.get('content-length') || '',
          'Access-Control-Expose-Headers': 'Content-Length, Accept-Ranges'
        });
      }
      
      // Stream the video through our server with optimized error handling
      if (response.body) {
        const reader = response.body.getReader();
        let streamClosed = false;

        const pump = async (): Promise<void> => {
          try {
            while (!streamClosed) {
              const { done, value } = await reader.read();
              
              if (done || streamClosed) {
                if (!streamClosed) {
                  res.end();
                  streamClosed = true;
                }
                return;
              }

              // Check if client is still connected
              if (res.destroyed || res.writableEnded) {
                streamClosed = true;
                return;
              }

              // Write chunk to response with better buffer management
              const chunk = Buffer.from(value);
              const writeSuccess = res.write(chunk);

              if (!writeSuccess && !streamClosed) {
                // Back pressure - wait for drain with timeout
                await Promise.race([
                  new Promise(resolve => res.once('drain', resolve)),
                  new Promise(resolve => setTimeout(resolve, 5000)) // 5s timeout
                ]);
              }
            }
          } catch (error) {
            if (!streamClosed) {
              console.error('❌ Stream error:', error);
              streamClosed = true;
              if (!res.destroyed) {
                res.end();
              }
            }
          }
        };

        // Handle client disconnect with cleanup
        const cleanup = () => {
          if (!streamClosed) {
            console.log('🔌 Client disconnected, closing stream');
            streamClosed = true;
            reader.cancel().catch(() => {});
          }
        };
        
        req.on('close', cleanup);
        req.on('aborted', cleanup);
        res.on('finish', cleanup);
        res.on('error', cleanup);

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
      
      // Use the metadata service with caching
      const result = await metadataService.fetchMetadata(identifier);
      
      // Return the cached or fresh metadata
      res.json({
        metadata: result.metadata,
        files: result.files,
        videoFile: result.selectedFile,
        videoFiles: result.files?.filter((f: any) => {
          const name = f.name?.toLowerCase() || '';
          const format = f.format?.toLowerCase() || '';
          return (
            name.endsWith('.mp4') ||
            name.endsWith('.webm') ||
            name.endsWith('.ogv') ||
            format.includes('mp4') ||
            format.includes('mpeg4') ||
            format.includes('h.264') ||
            format.includes('webm')
          );
        }) || [],
        streamUrl: result.streamUrl,
        checksum: result.checksum,
        detailsUrl: `https://archive.org/details/${identifier}`
      });
      
    } catch (error) {
      console.error("Metadata error:", error);
      res.status(500).json({ error: "Failed to get video metadata" });
    }
  });

  // Check video cache and enqueue transcoding if needed
  app.get("/api/cache/:identifier", apiLimiter, async (req, res) => {
    try {
      const { identifier } = req.params;
      
      // Check if video is already cached
      const cacheStatus = await transcodeService.isCached(identifier);
      
      if (cacheStatus.cached) {
        res.json({
          cached: true,
          paths: {
            mp4: cacheStatus.mp4Path,
            hls: cacheStatus.hlsPath,
            dash: cacheStatus.dashPath,
          }
        });
        return;
      }
      
      // Not cached - check if job is already running
      const existingJobs = transcodeService.getJobsByIdentifier(identifier);
      const activeJob = existingJobs.find(job => 
        job.status === 'pending' || 
        job.status === 'downloading' || 
        job.status === 'transcoding'
      );
      
      if (activeJob) {
        res.json({
          cached: false,
          warming: true,
          jobId: activeJob.id,
          status: activeJob.status,
          progress: activeJob.progress
        });
        return;
      }
      
      // Get metadata to find source URL
      const metadata = await metadataService.fetchMetadata(identifier);
      
      if (!metadata.selectedFile) {
        res.status(404).json({ error: "No suitable video file found" });
        return;
      }
      
      // Enqueue transcoding job
      const sourceUrl = `https://archive.org/download/${identifier}/${metadata.selectedFile.name}`;
      const jobId = await transcodeService.enqueueJob(identifier, sourceUrl);
      
      res.json({
        cached: false,
        warming: true,
        jobId,
        status: 'pending',
        progress: 0
      });
      
    } catch (error) {
      console.error("Cache check error:", error);
      res.status(500).json({ error: "Failed to check cache" });
    }
  });
  
  // Get transcoding job status
  app.get("/api/jobs/:jobId", apiLimiter, async (req, res) => {
    try {
      const { jobId } = req.params;
      const job = transcodeService.getJob(jobId);
      
      if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
      }
      
      res.json({
        id: job.id,
        identifier: job.identifier,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        error: job.error,
        outputPaths: job.outputPaths
      });
      
    } catch (error) {
      console.error("Job status error:", error);
      res.status(500).json({ error: "Failed to get job status" });
    }
  });
  
  // Serve cached videos
  app.get("/api/cached-video/:identifier", apiLimiter, async (req, res) => {
    try {
      const { identifier } = req.params;
      const cacheStatus = await transcodeService.isCached(identifier);
      
      if (!cacheStatus.cached || !cacheStatus.mp4Path) {
        res.status(404).json({ error: "Video not cached" });
        return;
      }
      
      // Handle range requests for the cached file
      const range = req.headers.range;
      const videoPath = cacheStatus.mp4Path;
      const stats = await fs.stat(videoPath);
      const fileSize = stats.size;
      
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        
        const stream = (await fs.open(videoPath, 'r')).createReadStream({ start, end });
        
        res.status(206).set({
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'video/mp4',
          'Cache-Control': 'public, max-age=31536000', // 1 year cache
        });
        
        stream.pipe(res);
      } else {
        res.set({
          'Content-Length': fileSize.toString(),
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000', // 1 year cache
        });
        
        const stream = (await fs.open(videoPath, 'r')).createReadStream();
        stream.pipe(res);
      }
      
    } catch (error) {
      console.error("Cached video serve error:", error);
      res.status(500).json({ error: "Failed to serve cached video" });
    }
  });
  
  // Serve HLS playlists and segments
  app.get("/api/hls/:identifier/:file", apiLimiter, async (req, res) => {
    try {
      const { identifier, file } = req.params;
      const hlsDir = path.join(process.env.VIDEO_CACHE_DIR || path.join(process.cwd(), 'video-cache'), 'hls', identifier);
      const filePath = path.join(hlsDir, file);
      
      // Security check - ensure file is within HLS directory
      if (!filePath.startsWith(hlsDir)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        res.status(404).json({ error: "HLS file not found" });
        return;
      }
      
      // Set appropriate content type
      const contentType = file.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' :
                         file.endsWith('.ts') ? 'video/mp2t' :
                         'application/octet-stream';
      
      res.set({
        'Content-Type': contentType,
        'Cache-Control': file.endsWith('.m3u8') ? 'no-cache' : 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      });
      
      const stream = (await fs.open(filePath, 'r')).createReadStream();
      stream.pipe(res);
      
    } catch (error) {
      console.error("HLS serve error:", error);
      res.status(500).json({ error: "Failed to serve HLS file" });
    }
  });
  
  // Cache statistics
  app.get("/api/cache-stats", async (req, res) => {
    try {
      const transcodeStats = await transcodeService.getCacheStats();
      // const cacheStats = CacheService.getStats();
      
      res.json({
        transcode: transcodeStats,
        // memory: cacheStats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Cache stats error:", error);
      res.status(500).json({ error: "Failed to get cache stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
