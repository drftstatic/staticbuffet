import { type VideoResult } from '@/lib/types';

interface CacheEntry {
  data: VideoResult[];
  timestamp: number;
  query: string;
  totalResults: number;
}

interface ThumbnailCacheEntry {
  url: string;
  retryCount: number;
  failed: boolean;
  timestamp: number;
}

class MetadataCache {
  private cacheKey = 'staticBuffet_metadataCache';
  private thumbnailCacheKey = 'staticBuffet_thumbnailCache';
  private maxAge = 15 * 60 * 1000; // 15 minutes
  private maxEntries = 50;
  private thumbnailMaxAge = 60 * 60 * 1000; // 1 hour for thumbnail retry info
  private maxThumbnailRetries = 3;

  // Get cached search results
  get(query: string, page: number = 1): CacheEntry | null {
    try {
      const cached = sessionStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const cache: { [key: string]: CacheEntry } = JSON.parse(cached);
      const key = this.getCacheKey(query, page);
      const entry = cache[key];

      if (!entry) return null;

      // Check if expired
      if (Date.now() - entry.timestamp > this.maxAge) {
        this.remove(query, page);
        return null;
      }

      return entry;
    } catch (error) {
      console.warn('Failed to read metadata cache:', error);
      return null;
    }
  }

  // Set cached search results
  set(query: string, page: number, data: VideoResult[], totalResults: number): void {
    try {
      const cached = sessionStorage.getItem(this.cacheKey);
      const cache: { [key: string]: CacheEntry } = cached ? JSON.parse(cached) : {};

      const key = this.getCacheKey(query, page);
      cache[key] = {
        data,
        timestamp: Date.now(),
        query,
        totalResults
      };

      // Clean up old entries
      this.cleanupCache(cache);

      sessionStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to write metadata cache:', error);
    }
  }

  // Remove specific entry
  remove(query: string, page: number = 1): void {
    try {
      const cached = sessionStorage.getItem(this.cacheKey);
      if (!cached) return;

      const cache: { [key: string]: CacheEntry } = JSON.parse(cached);
      const key = this.getCacheKey(query, page);
      delete cache[key];

      sessionStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to remove from metadata cache:', error);
    }
  }

  // Clear all cached data
  clear(): void {
    try {
      sessionStorage.removeItem(this.cacheKey);
      sessionStorage.removeItem(this.thumbnailCacheKey);
    } catch (error) {
      console.warn('Failed to clear metadata cache:', error);
    }
  }

  // Thumbnail retry management
  shouldRetryThumbnail(identifier: string): boolean {
    try {
      const cached = sessionStorage.getItem(this.thumbnailCacheKey);
      if (!cached) return true;

      const cache: { [key: string]: ThumbnailCacheEntry } = JSON.parse(cached);
      const entry = cache[identifier];

      if (!entry) return true;

      // Check if expired
      if (Date.now() - entry.timestamp > this.thumbnailMaxAge) {
        delete cache[identifier];
        sessionStorage.setItem(this.thumbnailCacheKey, JSON.stringify(cache));
        return true;
      }

      return entry.retryCount < this.maxThumbnailRetries && !entry.failed;
    } catch (error) {
      console.warn('Failed to check thumbnail retry status:', error);
      return true;
    }
  }

  // Record thumbnail failure
  recordThumbnailFailure(identifier: string): void {
    try {
      const cached = sessionStorage.getItem(this.thumbnailCacheKey);
      const cache: { [key: string]: ThumbnailCacheEntry } = cached ? JSON.parse(cached) : {};

      const existing = cache[identifier] || { retryCount: 0, failed: false, url: '', timestamp: 0 };
      cache[identifier] = {
        ...existing,
        retryCount: existing.retryCount + 1,
        failed: existing.retryCount + 1 >= this.maxThumbnailRetries,
        timestamp: Date.now()
      };

      sessionStorage.setItem(this.thumbnailCacheKey, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to record thumbnail failure:', error);
    }
  }

  // Record successful thumbnail load
  recordThumbnailSuccess(identifier: string, url: string): void {
    try {
      const cached = sessionStorage.getItem(this.thumbnailCacheKey);
      const cache: { [key: string]: ThumbnailCacheEntry } = cached ? JSON.parse(cached) : {};

      cache[identifier] = {
        url,
        retryCount: 0,
        failed: false,
        timestamp: Date.now()
      };

      sessionStorage.setItem(this.thumbnailCacheKey, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to record thumbnail success:', error);
    }
  }

  // Get cached thumbnail URL
  getCachedThumbnailUrl(identifier: string): string | null {
    try {
      const cached = sessionStorage.getItem(this.thumbnailCacheKey);
      if (!cached) return null;

      const cache: { [key: string]: ThumbnailCacheEntry } = JSON.parse(cached);
      const entry = cache[identifier];

      if (!entry || entry.failed) return null;

      // Check if expired
      if (Date.now() - entry.timestamp > this.thumbnailMaxAge) {
        return null;
      }

      return entry.url;
    } catch (error) {
      console.warn('Failed to get cached thumbnail URL:', error);
      return null;
    }
  }

  // Get cache statistics
  getCacheStats(): {
    metadataEntries: number;
    thumbnailEntries: number;
    size: number;
  } {
    try {
      const metadataCache = sessionStorage.getItem(this.cacheKey);
      const thumbnailCache = sessionStorage.getItem(this.thumbnailCacheKey);

      const metadataEntries = metadataCache ? Object.keys(JSON.parse(metadataCache)).length : 0;
      const thumbnailEntries = thumbnailCache ? Object.keys(JSON.parse(thumbnailCache)).length : 0;
      const size = (metadataCache?.length || 0) + (thumbnailCache?.length || 0);

      return {
        metadataEntries,
        thumbnailEntries,
        size
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return { metadataEntries: 0, thumbnailEntries: 0, size: 0 };
    }
  }

  private getCacheKey(query: string, page: number): string {
    return `${query}_page${page}`;
  }

  private cleanupCache(cache: { [key: string]: CacheEntry }): void {
    const entries = Object.entries(cache);
    
    if (entries.length <= this.maxEntries) return;

    // Sort by timestamp (oldest first)
    const sortedEntries = entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
    // Remove oldest entries
    const toRemove = sortedEntries.slice(0, entries.length - this.maxEntries);
    toRemove.forEach(([key]) => delete cache[key]);
  }
}

// Global cache instance
export const metadataCache = new MetadataCache();