import { db, isDatabaseAvailable } from './db.js';
import { searchCacheTable, type SearchFilters } from '../shared/schema.js';
import { eq, lt } from 'drizzle-orm';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

const SEARCH_CACHE_TTL_HOURS = 6; // 6 hours cache TTL for search results

export interface SearchResult {
  docs: any[];
  numFound: number;
  start: number;
}

export interface CachedSearchResult {
  id: string;
  queryHash: string;
  query: string;
  filters: SearchFilters;
  results: SearchResult;
  totalResults: number;
  cachedAt: string;
  expiresAt: string;
  hitCount: number;
}

class SearchCacheService {
  private memoryCache = new Map<string, CachedSearchResult>();
  private readonly maxMemoryCache = 100; // Maximum entries in memory

  /**
   * Generate a hash for the search query and filters
   */
  private generateQueryHash(filters: SearchFilters): string {
    const queryString = JSON.stringify({
      query: filters.query.toLowerCase().trim(),
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      durationMin: filters.durationMin,
      durationMax: filters.durationMax,
      license: filters.license,
      sort: filters.sort,
      page: filters.page,
      rows: filters.rows,
      sources: filters.sources?.sort(), // Sort to ensure consistent ordering
      allowRestrictedLicenses: filters.allowRestrictedLicenses,
    });
    
    return crypto.createHash('sha256').update(queryString).digest('hex');
  }

  /**
   * Get cached search results
   */
  async getCachedResults(filters: SearchFilters): Promise<SearchResult | null> {
    const queryHash = this.generateQueryHash(filters);
    
    // Check memory cache first
    const memoryResult = this.memoryCache.get(queryHash);
    if (memoryResult && new Date(memoryResult.expiresAt) > new Date()) {
      console.log(`🎯 Search memory cache hit for query: ${filters.query}`);
      return memoryResult.results;
    }

    // Check database cache (only if database is available)
    if (isDatabaseAvailable && db) {
      try {
        const dbResult = await db
          .select()
          .from(searchCacheTable)
          .where(eq(searchCacheTable.queryHash, queryHash))
          .limit(1);

      if (dbResult.length > 0) {
        const cached = dbResult[0];
        
        // Check if cache has expired
        if (new Date(cached.expiresAt) > new Date()) {
          console.log(`🗄️ Search database cache hit for query: ${filters.query}`);
          
          // Update hit count and last accessed
          await db
            .update(searchCacheTable)
            .set({ 
              hitCount: cached.hitCount + 1,
              lastAccessed: new Date()
            })
            .where(eq(searchCacheTable.id, cached.id));

          // Convert to cached result format
          const cacheData: CachedSearchResult = {
            id: cached.id,
            queryHash: cached.queryHash,
            query: cached.query,
            filters: cached.filters as SearchFilters,
            results: cached.results as SearchResult,
            totalResults: cached.totalResults,
            cachedAt: cached.cachedAt.toISOString(),
            expiresAt: cached.expiresAt.toISOString(),
            hitCount: cached.hitCount,
          };

          // Add to memory cache for faster subsequent access
          this.addToMemoryCache(queryHash, cacheData);
          
          return cacheData.results;
        } else {
          console.log(`⏰ Search cache expired for query: ${filters.query}, removing`);
          await db
            .delete(searchCacheTable)
            .where(eq(searchCacheTable.queryHash, queryHash));
        }
      }

      console.log(`📦 No search cache for query: ${filters.query}`);
      return null;
      } catch (error) {
        console.error('Error fetching from search cache:', error);
        return null;
      }
    }

    // If database not available, just return null (cache miss)
    return null;
  }

  /**
   * Save search results to cache
   */
  async saveResults(filters: SearchFilters, results: SearchResult): Promise<void> {
    const queryHash = this.generateQueryHash(filters);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SEARCH_CACHE_TTL_HOURS);

    const cacheData: CachedSearchResult = {
      id: nanoid(),
      queryHash,
      query: filters.query,
      filters,
      results,
      totalResults: results.numFound,
      cachedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      hitCount: 1,
    };

    // Save to memory cache
    this.addToMemoryCache(queryHash, cacheData);

    // Save to database (only if available)
    if (isDatabaseAvailable && db) {
      try {
        await db
          .insert(searchCacheTable)
          .values({
            id: cacheData.id,
            queryHash: queryHash,
            query: filters.query,
            filters: filters,
            results: results,
            totalResults: results.numFound,
            expiresAt: expiresAt,
            hitCount: 1,
          })
          .onConflictDoUpdate({
            target: searchCacheTable.queryHash,
            set: {
              query: filters.query,
              filters: filters,
              results: results,
              totalResults: results.numFound,
              expiresAt: expiresAt,
              hitCount: 1,
              lastAccessed: new Date(),
            },
          });

        console.log(`💾 Saved search results to cache for query: ${filters.query}`);
      } catch (error) {
        console.error('Error saving search results to cache:', error);
      }
    } else {
      console.log(`💾 Saved search results to memory cache for query: ${filters.query}`);
    }
  }

  /**
   * Add to memory cache with LRU eviction
   */
  private addToMemoryCache(queryHash: string, cacheData: CachedSearchResult): void {
    // Remove oldest entries if cache is full
    if (this.memoryCache.size >= this.maxMemoryCache) {
      // Simple LRU: remove first entry (oldest)
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }

    this.memoryCache.set(queryHash, cacheData);
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredCache(): Promise<void> {
    try {
      // Clean database cache (only if available)
      if (isDatabaseAvailable && db) {
        const result = await db
          .delete(searchCacheTable)
          .where(lt(searchCacheTable.expiresAt, new Date()));
        
        console.log(`🧹 Cleaned up expired search cache entries from database`);
      }
      
      // Clean memory cache
      for (const [key, value] of this.memoryCache.entries()) {
        if (new Date(value.expiresAt) <= new Date()) {
          this.memoryCache.delete(key);
        }
      }
      console.log(`🧹 Cleaned up expired search cache entries from memory`);
    } catch (error) {
      console.error('Error cleaning up expired search cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    try {
      let databaseEntries = 0;
      
      if (isDatabaseAvailable && db) {
        const totalEntries = await db
          .select({ count: searchCacheTable.id })
          .from(searchCacheTable);
        databaseEntries = totalEntries.length;
      }
      
      return {
        memoryEntries: this.memoryCache.size,
        databaseEntries,
        maxMemoryEntries: this.maxMemoryCache,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        memoryEntries: this.memoryCache.size,
        databaseEntries: 0,
        maxMemoryEntries: this.maxMemoryCache,
      };
    }
  }
}

export const searchCacheService = new SearchCacheService();
