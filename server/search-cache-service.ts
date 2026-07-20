import { type SearchFilters } from '../shared/schema.js';
import crypto from 'crypto';

const SEARCH_CACHE_TTL_HOURS = 6;

export interface SearchResult {
  docs: any[];
  numFound: number;
  start: number;
}

interface CachedSearchResult {
  queryHash: string;
  results: SearchResult;
  expiresAt: string;
}

class SearchCacheService {
  private memoryCache = new Map<string, CachedSearchResult>();
  private readonly maxMemoryCache = 100;

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
      sources: filters.sources?.sort(),
      allowRestrictedLicenses: filters.allowRestrictedLicenses,
    });

    return crypto.createHash('sha256').update(queryString).digest('hex');
  }

  async getCachedResults(filters: SearchFilters): Promise<SearchResult | null> {
    const queryHash = this.generateQueryHash(filters);
    const cached = this.memoryCache.get(queryHash);
    if (cached && new Date(cached.expiresAt) > new Date()) {
      // Refresh LRU position
      this.memoryCache.delete(queryHash);
      this.memoryCache.set(queryHash, cached);
      return cached.results;
    }
    if (cached) this.memoryCache.delete(queryHash);
    return null;
  }

  async saveResults(filters: SearchFilters, results: SearchResult): Promise<void> {
    const queryHash = this.generateQueryHash(filters);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SEARCH_CACHE_TTL_HOURS);

    if (this.memoryCache.size >= this.maxMemoryCache) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) this.memoryCache.delete(firstKey);
    }
    this.memoryCache.set(queryHash, { queryHash, results, expiresAt: expiresAt.toISOString() });
  }

  async cleanupExpiredCache(): Promise<void> {
    const now = new Date();
    for (const [key, value] of this.memoryCache.entries()) {
      if (new Date(value.expiresAt) <= now) {
        this.memoryCache.delete(key);
      }
    }
  }

  async getCacheStats() {
    return {
      memoryEntries: this.memoryCache.size,
      maxMemoryEntries: this.maxMemoryCache,
    };
  }
}

export const searchCacheService = new SearchCacheService();
