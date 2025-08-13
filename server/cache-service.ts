interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  hits: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000; // Maximum number of entries
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  public set<T>(key: string, data: T, ttlMinutes: number = 60): void {
    const now = Date.now();
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: ttlMinutes * 60 * 1000,
      hits: 0
    });
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    
    // Check if expired
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count for LRU
    entry.hits++;
    entry.timestamp = now; // Update access time
    
    return entry.data;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    
    console.log(`🧹 Cache cleanup: removed ${keysToDelete.length} expired entries`);
  }

  private evictLRU(): void {
    // Find least recently used entry (lowest hits + oldest timestamp)
    let lruKey: string | null = null;
    let lruScore = Infinity;

    for (const [key, entry] of Array.from(this.cache.entries())) {
      // Score based on hits and age (lower is worse)
      const score = entry.hits + (Date.now() - entry.timestamp) / 1000;
      
      if (score < lruScore) {
        lruScore = score;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      console.log(`📤 Evicted LRU cache entry: ${lruKey}`);
    }
  }

  public getStats(): { size: number; maxSize: number; hitRate: number } {
    let totalHits = 0;
    let totalAccesses = 0;

    for (const entry of Array.from(this.cache.values())) {
      totalHits += entry.hits;
      totalAccesses += entry.hits + 1; // +1 for initial set
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalAccesses > 0 ? totalHits / totalAccesses : 0
    };
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Cache instances for different data types
export const searchCache = new InMemoryCache();
export const metadataCache = new InMemoryCache();
export const thumbnailCache = new InMemoryCache();

// Helper functions for specific cache operations
export class CacheService {
  // Search result caching with smart key generation
  static getSearchCacheKey(filters: any): string {
    const normalized = {
      query: filters.query?.toLowerCase().trim(),
      license: filters.license,
      sort: filters.sort,
      sources: Array.isArray(filters.sources) ? filters.sources.sort() : filters.sources,
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      page: filters.page,
      rows: filters.rows
    };
    
    return `search:${JSON.stringify(normalized)}`;
  }

  static cacheSearchResults(filters: any, results: any, ttlMinutes: number = 30): void {
    const key = this.getSearchCacheKey(filters);
    searchCache.set(key, results, ttlMinutes);
    console.log(`💾 Cached search results for: ${key.substring(0, 100)}...`);
  }

  static getCachedSearchResults(filters: any): any | null {
    const key = this.getSearchCacheKey(filters);
    const cached = searchCache.get(key);
    
    if (cached) {
      console.log(`⚡ Cache hit for search: ${key.substring(0, 100)}...`);
    }
    
    return cached;
  }

  // Metadata caching
  static cacheMetadata(identifier: string, metadata: any, ttlMinutes: number = 120): void {
    const key = `metadata:${identifier}`;
    metadataCache.set(key, metadata, ttlMinutes);
  }

  static getCachedMetadata(identifier: string): any | null {
    const key = `metadata:${identifier}`;
    return metadataCache.get(key);
  }

  // Thumbnail caching
  static cacheThumbnail(identifier: string, thumbnailData: any, ttlMinutes: number = 1440): void { // 24 hours
    const key = `thumbnail:${identifier}`;
    thumbnailCache.set(key, thumbnailData, ttlMinutes);
  }

  static getCachedThumbnail(identifier: string): any | null {
    const key = `thumbnail:${identifier}`;
    return thumbnailCache.get(key);
  }

  // Warm up cache with popular content
  static async warmupCache(): Promise<void> {
    console.log('🔥 Starting cache warmup...');
    
    // Warm up with popular searches
    const popularQueries = [
      'nature',
      'documentary',
      'vintage',
      'science',
      'history'
    ];

    // This would normally be done in background
    // For now, just log the intent
    console.log(`🔥 Would warm up cache with queries: ${popularQueries.join(', ')}`);
  }

  // Get overall cache statistics
  static getStats(): any {
    return {
      search: searchCache.getStats(),
      metadata: metadataCache.getStats(),
      thumbnail: thumbnailCache.getStats()
    };
  }

  // Clear all caches
  static clearAll(): void {
    searchCache.clear();
    metadataCache.clear();
    thumbnailCache.clear();
    console.log('🧹 All caches cleared');
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down cache service...');
  searchCache.destroy();
  metadataCache.destroy();
  thumbnailCache.destroy();
});