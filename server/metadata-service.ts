import { db, isDatabaseAvailable } from './db';
import { metadataCacheSchema, metadataCacheTable, type MetadataCache } from '@shared/schema';
import { eq, lt } from 'drizzle-orm';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

const CACHE_TTL_HOURS = 48; // 48 hours cache TTL

interface VideoFile {
  name: string;
  format: string;
  size?: string;
  md5?: string;
  original?: string;
  mtime?: string;
  source?: string;
  length?: string;
  height?: string;
  width?: string;
}

interface ArchiveMetadataResponse {
  metadata: Record<string, any>;
  files: VideoFile[];
  server: string;
  dir: string;
}

export class MetadataService {
  private cacheStore = new Map<string, MetadataCache>();

  /**
   * Select the best video derivative, prioritizing MP4/H.264 for compatibility
   */
  private selectBestDerivative(files: VideoFile[]): VideoFile | null {
    if (!files || files.length === 0) return null;

    // Filter for video files only
    const videoFiles = files.filter((file) => {
      const name = file.name?.toLowerCase() || '';
      const format = file.format?.toLowerCase() || '';
      
      // Include common video formats
      return (
        name.endsWith('.mp4') ||
        name.endsWith('.webm') ||
        name.endsWith('.ogv') ||
        name.endsWith('.avi') ||
        name.endsWith('.mov') ||
        name.endsWith('.m4v') ||
        name.endsWith('.mkv') ||
        name.endsWith('.wmv') ||
        name.endsWith('.flv') ||
        format.includes('mp4') ||
        format.includes('mpeg4') ||
        format.includes('mpeg2') ||
        format.includes('mpeg') ||
        format.includes('h.264') ||
        format.includes('h264') ||
        format.includes('webm') ||
        format.includes('ogg video') ||
        format.includes('cinepack') ||
        format.includes('hires') ||
        format.toLowerCase() === 'mpeg4' ||
        format.toLowerCase() === 'mpeg2'
      );
    });

    if (videoFiles.length === 0) return null;

    // Sort by priority
    const sortedFiles = videoFiles.sort((a, b) => {
      const aName = a.name?.toLowerCase() || '';
      const bName = b.name?.toLowerCase() || '';
      const aFormat = a.format?.toLowerCase() || '';
      const bFormat = b.format?.toLowerCase() || '';

      // Priority 1: MP4/H.264 files (best compatibility)
      const aIsMp4 = aName.endsWith('.mp4') || 
                     aFormat.includes('mp4') || 
                     aFormat.includes('mpeg4') || 
                     aFormat.includes('h.264') ||
                     aFormat.includes('h264');
      const bIsMp4 = bName.endsWith('.mp4') || 
                     bFormat.includes('mp4') || 
                     bFormat.includes('mpeg4') || 
                     bFormat.includes('h.264') ||
                     bFormat.includes('h264');
      
      if (aIsMp4 && !bIsMp4) return -1;
      if (!aIsMp4 && bIsMp4) return 1;

      // Priority 2: WebM (good modern browser support)
      const aIsWebM = aName.endsWith('.webm') || aFormat.includes('webm');
      const bIsWebM = bName.endsWith('.webm') || bFormat.includes('webm');
      
      if (aIsWebM && !bIsWebM) return -1;
      if (!aIsWebM && bIsWebM) return 1;

      // Priority 3: Files without quality suffixes (original/full resolution)
      const aHasQualitySuffix = /_\d+kb|_small|_low|_thumb/.test(aName);
      const bHasQualitySuffix = /_\d+kb|_small|_low|_thumb/.test(bName);
      
      if (!aHasQualitySuffix && bHasQualitySuffix) return -1;
      if (aHasQualitySuffix && !bHasQualitySuffix) return 1;

      // Priority 4: Higher bitrate if both have quality indicators
      const aMatch = aName.match(/_(\d+)kb/);
      const bMatch = bName.match(/_(\d+)kb/);
      
      if (aMatch && bMatch) {
        const aBitrate = parseInt(aMatch[1]);
        const bBitrate = parseInt(bMatch[1]);
        return bBitrate - aBitrate; // Higher bitrate first
      }

      // Priority 5: Prefer files with original flag
      if (a.original === 'true' && b.original !== 'true') return -1;
      if (a.original !== 'true' && b.original === 'true') return 1;

      // Priority 6: File size (larger = higher quality, usually)
      const aSize = parseInt(a.size || '0');
      const bSize = parseInt(b.size || '0');
      
      return bSize - aSize;
    });

    return sortedFiles[0];
  }

  /**
   * Generate a checksum for the selected file to verify cache validity
   */
  private generateChecksum(file: VideoFile): string {
    const data = `${file.name}-${file.format}-${file.size || ''}-${file.md5 || ''}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  /**
   * Check if cached metadata is still valid
   */
  private isCacheValid(cache: MetadataCache): boolean {
    const now = new Date();
    const expiresAt = new Date(cache.expiresAt);
    return now < expiresAt;
  }

  /**
   * Get cached metadata from memory or database
   */
  async getCachedMetadata(identifier: string): Promise<MetadataCache | null> {
    // Check memory cache first
    const memCache = this.cacheStore.get(identifier);
    if (memCache && this.isCacheValid(memCache)) {
      console.log(`📦 Memory cache hit for ${identifier}`);
      return memCache;
    }

    // Check database cache
    if (!isDatabaseAvailable || !db) {
      return null;
    }
    try {
      const dbResult = await db
        .select()
        .from(metadataCacheTable)
        .where(eq(metadataCacheTable.identifier, identifier))
        .limit(1);

      if (dbResult.length > 0) {
        const cached = dbResult[0];
        
        // Check if cache has expired
        if (new Date(cached.expiresAt) > new Date()) {
          console.log(`🗄️ Database cache hit for ${identifier}`);
          
          // Update access statistics
          await db
            .update(metadataCacheTable)
            .set({ 
              accessCount: cached.accessCount + 1,
              lastAccessed: new Date()
            })
            .where(eq(metadataCacheTable.id, cached.id));

          // Convert to MetadataCache format
          const cacheData: MetadataCache = {
            id: cached.id,
            identifier: cached.identifier,
            metadata: cached.metadata as any,
            files: cached.files as any,
            selectedFile: cached.selectedFile as any,
            streamUrl: cached.streamUrl,
            cachedAt: cached.cachedAt.toISOString(),
            expiresAt: cached.expiresAt.toISOString(),
          };

          // Add to memory cache for faster subsequent access
          this.cacheStore.set(identifier, cacheData);
          
          return cacheData;
        } else {
          console.log(`⏰ Database cache expired for ${identifier}, removing`);
          await db
            .delete(metadataCacheTable)
            .where(eq(metadataCacheTable.identifier, identifier));
        }
      }

      console.log(`📦 No database cache for ${identifier}`);
      return null;
    } catch (error) {
      console.error('Error fetching from database cache:', error);
      return null;
    }
  }

  /**
   * Save metadata to cache (memory and database)
   */
  async saveToCache(identifier: string, cache: MetadataCache): Promise<void> {
    // Save to memory cache
    this.cacheStore.set(identifier, cache);
    console.log(`💾 Saved ${identifier} to memory cache`);

    // Save to database
    if (!isDatabaseAvailable || !db) {
      return;
    }
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + CACHE_TTL_HOURS);

      await db
        .insert(metadataCacheTable)
        .values({
          id: nanoid(),
          identifier: cache.identifier,
          metadata: cache.metadata,
          files: cache.files,
          selectedFile: cache.selectedFile,
          streamUrl: cache.streamUrl,
          expiresAt: expiresAt,
          accessCount: 1,
        })
        .onConflictDoUpdate({
          target: metadataCacheTable.identifier,
          set: {
            metadata: cache.metadata,
            files: cache.files,
            selectedFile: cache.selectedFile,
            streamUrl: cache.streamUrl,
            expiresAt: expiresAt,
            accessCount: 1,
            lastAccessed: new Date(),
          },
        });

      console.log(`💾 Saved ${identifier} to database cache`);
    } catch (error) {
      console.error('Error saving to database cache:', error);
    }
  }

  /**
   * Fetch and cache metadata from Internet Archive
   */
  async fetchMetadata(identifier: string): Promise<{
    metadata: Record<string, any>;
    files: VideoFile[];
    selectedFile: VideoFile | null;
    streamUrl: string | null;
    checksum: string | null;
  }> {
    // Check cache first
    const cached = await this.getCachedMetadata(identifier);
    if (cached) {
      return {
        metadata: cached.metadata,
        files: cached.files,
        selectedFile: cached.selectedFile,
        streamUrl: cached.streamUrl,
        checksum: cached.selectedFile.checksum || null,
      };
    }

    console.log(`🌐 Fetching fresh metadata for ${identifier} from Archive.org`);

    // Fetch from Internet Archive
    const metadataUrl = `https://archive.org/metadata/${identifier}`;
    
    let response;
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        response = await fetch(metadataUrl, {
          headers: {
            'User-Agent': 'StaticBuffet/1.0 (+https://staticbuffet.tv)',
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          break;
        }

        if (response.status === 429) {
          // Rate limited, wait longer
          const delay = (4 - retries) * 2000;
          console.log(`⏳ Rate limited, waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          const delay = (4 - retries) * 1000;
          console.log(`⚠️ Fetch failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Failed to fetch metadata after retries: ${lastError}`);
    }

    const data: ArchiveMetadataResponse = await response.json();

    // Select best derivative
    const selectedFile = this.selectBestDerivative(data.files);
    
    if (!selectedFile) {
      console.warn(`⚠️ No suitable video file found for ${identifier}`);
      return {
        metadata: data.metadata,
        files: data.files,
        selectedFile: null,
        streamUrl: null,
        checksum: null,
      };
    }

    // Generate checksum and stream URL
    const checksum = this.generateChecksum(selectedFile);
    const streamUrl = `/api/video/${identifier}/${encodeURIComponent(selectedFile.name)}`;

    console.log(`✅ Selected file: ${selectedFile.name} (${selectedFile.format})`);
    console.log(`🔑 Checksum: ${checksum}`);

    // Prepare cache entry
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000);

    const cacheEntry: MetadataCache = {
      id: `${identifier}-${now.getTime()}`,
      identifier,
      metadata: data.metadata,
      files: data.files,
      selectedFile: {
        ...selectedFile,
        checksum,
      },
      streamUrl,
      cachedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // Save to cache
    await this.saveToCache(identifier, cacheEntry);

    return {
      metadata: data.metadata,
      files: data.files,
      selectedFile,
      streamUrl,
      checksum,
    };
  }

  /**
   * Clean up expired cache entries (memory and database)
   */
  async cleanupExpiredCache(): Promise<void> {
    // Clean memory cache
    const entries = Array.from(this.cacheStore.entries());
    for (const [identifier, cache] of entries) {
      if (!this.isCacheValid(cache)) {
        this.cacheStore.delete(identifier);
        console.log(`🗑️ Removed expired cache for ${identifier}`);
      }
    }

    // Clean database cache
    if (isDatabaseAvailable && db) {
      try {
        await db
          .delete(metadataCacheTable)
          .where(lt(metadataCacheTable.expiresAt, new Date()));

        console.log(`🧹 Cleaned up expired metadata cache entries from database`);
      } catch (error) {
        console.error('Error cleaning up expired metadata cache:', error);
      }
    }
  }
}

// Export singleton instance
export const metadataService = new MetadataService();

// Set up periodic cleanup (every hour)
setInterval(() => {
  metadataService.cleanupExpiredCache().catch(console.error);
}, 60 * 60 * 1000);