import { type SearchFilters, type Video } from "@shared/schema";
import { type SearchState } from "./types";
import { metadataCache } from './metadata-cache';

// Global abort controller for cancelling requests
let currentSearchController: AbortController | null = null;
let searchDebounceTimer: NodeJS.Timeout | null = null;

// Debounced search function
export function searchVideosDebounced(filters: SearchState, delay: number = 300): Promise<any> {
  return new Promise((resolve, reject) => {
    // Clear existing timer
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    // Set new timer
    searchDebounceTimer = setTimeout(async () => {
      try {
        const result = await searchVideos(filters);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

export async function searchVideos(filters: SearchState) {
  console.log('searchVideos called with filters:', filters);
  
  // Validate and clean query
  if (!filters.query || filters.query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }
  
  if (filters.query.trim().length < 2) {
    throw new Error('Search query must be at least 2 characters');
  }
  
  // Clean up common query issues
  const cleanQuery = filters.query.trim()
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/[^\w\s\-'"]/g, ' ') // Remove special chars except quotes and hyphens
    .trim();
    
  if (cleanQuery.length === 0) {
    throw new Error('Search query contains only invalid characters');
  }
  
  // Cancel any existing search
  if (currentSearchController) {
    currentSearchController.abort();
  }

  // Create new abort controller
  currentSearchController = new AbortController();

  // Check cache first
  const cacheKey = JSON.stringify(filters);
  const cached = metadataCache.get(cacheKey, filters.page || 1);
  if (cached) {
    console.log('Cache hit for search:', cacheKey);
    return {
      docs: cached.data,
      numFound: cached.totalResults,
      start: ((filters.page || 1) - 1) * 50
    };
  }
  const params = new URLSearchParams();
  
  if (cleanQuery) params.set('query', cleanQuery);
  if (filters.yearFrom) params.set('yearFrom', filters.yearFrom);
  if (filters.yearTo) params.set('yearTo', filters.yearTo);
  
  // Map duration filter to min/max
  if (filters.duration === 'short') {
    params.set('durationMax', '300'); // 5 minutes
  } else if (filters.duration === 'medium') {
    params.set('durationMin', '300');
    params.set('durationMax', '1800'); // 30 minutes
  } else if (filters.duration === 'long') {
    params.set('durationMin', '1800');
  }
  
  if (filters.license) params.set('license', filters.license);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.sources && filters.sources.length > 0) {
    params.set('sources', filters.sources.join(','));
  }
  if (filters.allowRestrictedLicenses !== undefined) {
    params.set('allowRestrictedLicenses', filters.allowRestrictedLicenses.toString());
  }
  
  // Set default rows if not specified (reduced for faster loading)
  params.set('rows', '25');

  // Pre-cache popular queries when user is idle
  if (cleanQuery.length > 0) {
    queuePopularQueryPrecache(cleanQuery);
  }

  // Enhanced client-side retry logic with intelligent backoff
  let lastError;
  let result;
  const maxRetries = 3; // Increased from 2 for better resilience
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 Client search attempt ${attempt}/${maxRetries} - URL: /api/search?${params.toString()}`);
      
      // Add timeout to prevent hanging requests
      const timeoutMs = 15000 + (attempt * 5000); // Progressive timeout: 15s, 20s, 25s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'X-Retry-Attempt': attempt.toString(),
            'X-Client-Version': '2.0'
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          let errorData: any = {};
          try {
            errorData = await response.json();
          } catch {
            errorData = { error: await response.text() };
          }
          
          // Enhanced error messages with server context
          const serverError = errorData.error || 'Unknown error';
          const suggestions = errorData.suggestions || [];
          const errorType = errorData.type || 'unknown';
          
          console.error(`❌ Client search failed: ${response.status}`, {
            error: serverError,
            type: errorType,
            suggestions,
            attempt
          });
          
          // Create contextual error messages
          if (response.status === 429) {
            throw new Error('Archive.org rate limit reached - please wait 10-15 seconds before trying again');
          } else if (response.status === 502 || response.status === 503) {
            throw new Error(`Archive.org servers are overloaded (${response.status}) - try again in a few moments`);
          } else if (response.status === 400) {
            throw new Error(`${serverError}${suggestions.length ? '. Try: ' + suggestions[0] : ''}`);
          } else {
            throw new Error(`${serverError} (HTTP ${response.status})`);
          }
        }
      
        result = await response.json();
        
        // Validate result structure
        if (!result || typeof result !== 'object') {
          throw new Error('Invalid response format from search API');
        }
        
        console.log(`✅ Client search successful on attempt ${attempt}, found ${result.numFound || 0} results`);
        break; // Success, exit retry loop
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
      
    } catch (error) {
      lastError = error;
      
      // Don't retry if the request was aborted by user (not timeout)
      if (error instanceof Error && error.name === 'AbortError' && !error.message.includes('timeout')) {
        throw error;
      }
      
      console.error(`❌ Client search attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
      
      if (attempt < maxRetries) {
        // Smart retry delay based on error type
        let delay = 1000; // Base delay
        
        if (error instanceof Error) {
          const errorMsg = error.message.toLowerCase();
          if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
            delay = 12000; // Longer delay for rate limits
          } else if (errorMsg.includes('overloaded') || errorMsg.includes('503')) {
            delay = 5000 * attempt; // Progressive delay for server issues
          } else if (errorMsg.includes('timeout')) {
            delay = 2000 * attempt; // Moderate delay for timeouts
          } else {
            delay = 1000 * Math.pow(2, attempt - 1); // Exponential backoff for other errors
          }
        }
        
        console.log(`⏳ Retrying search in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  if (!result) {
    const finalError = lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(`Search failed after ${maxRetries} attempts. Archive.org may be experiencing issues. Last error: ${finalError}`);
  }
  
  // Cache the results only if we have valid data
  if (result.docs && Array.isArray(result.docs) && result.docs.length > 0) {
    metadataCache.set(cacheKey, filters.page || 1, result.docs, result.numFound || 0);
    console.log(`Cached ${result.docs.length} search results`);
  }
  
  return result;
}

export async function getVideoMetadata(identifier: string) {
  // Check client-side cache first
  const cacheKey = `metadata_${identifier}`;
  const cached = metadataCache.getCachedThumbnailUrl(identifier);
  
  const response = await fetch(`/api/metadata/${identifier}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get metadata: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Log cache hit information
  if (data.checksum) {
    console.log(`✅ Metadata for ${identifier} - Checksum: ${data.checksum}`);
  }
  
  return data;
}

// Check video cache status and initiate warming if needed
export async function checkVideoCache(identifier: string) {
  const response = await fetch(`/api/cache/${identifier}`);
  
  if (!response.ok) {
    throw new Error(`Failed to check cache: ${response.statusText}`);
  }
  
  return response.json();
}

// Get transcoding job status
export async function getJobStatus(jobId: string) {
  const response = await fetch(`/api/jobs/${jobId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get job status: ${response.statusText}`);
  }
  
  return response.json();
}

// Get the best video URL (cached or fallback)
export async function getVideoUrl(identifier: string): Promise<{
  url: string;
  cached: boolean;
  warming?: boolean;
  jobId?: string;
  progress?: number;
}> {
  try {
    // Check cache first
    const cacheStatus = await checkVideoCache(identifier);
    
    if (cacheStatus.cached) {
      return {
        url: `/api/cached-video/${identifier}`,
        cached: true
      };
    }
    
    if (cacheStatus.warming) {
      // Return fallback URL while warming
      const metadata = await getVideoMetadata(identifier);
      
      return {
        url: metadata.streamUrl, // Fallback to direct IA streaming
        cached: false,
        warming: true,
        jobId: cacheStatus.jobId,
        progress: cacheStatus.progress
      };
    }
    
    // Not cached and not warming - this shouldn't happen if checkVideoCache worked
    const metadata = await getVideoMetadata(identifier);
    return {
      url: metadata.streamUrl,
      cached: false
    };
    
  } catch (error) {
    console.error('Failed to get video URL:', error);
    // Fallback to metadata approach
    const metadata = await getVideoMetadata(identifier);
    return {
      url: metadata.streamUrl,
      cached: false
    };
  }
}

export function generateThumbnailUrl(identifier: string): string {
  return `https://archive.org/services/img/${identifier}`;
}

// Cancel current search
export function cancelCurrentSearch(): void {
  if (currentSearchController) {
    currentSearchController.abort();
    currentSearchController = null;
  }
}

// Poll job status until completion
export async function pollJobStatus(
  jobId: string, 
  onProgress?: (progress: number, status: string) => void,
  intervalMs: number = 2000
): Promise<any> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const job = await getJobStatus(jobId);
        
        if (onProgress) {
          onProgress(job.progress, job.status);
        }
        
        if (job.status === 'completed') {
          resolve(job);
        } else if (job.status === 'failed') {
          reject(new Error(job.error || 'Transcoding failed'));
        } else {
          // Continue polling
          setTimeout(poll, intervalMs);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    poll();
  });
}

// Preload thumbnail with retry logic
export async function preloadThumbnail(identifier: string, signal?: AbortSignal): Promise<string> {
  // Check if we should retry this thumbnail
  if (!metadataCache.shouldRetryThumbnail(identifier)) {
    throw new Error('Thumbnail retry limit exceeded');
  }

  // Check for cached URL first
  const cachedUrl = metadataCache.getCachedThumbnailUrl(identifier);
  if (cachedUrl) {
    return cachedUrl;
  }

  const thumbnailUrl = generateThumbnailUrl(identifier);

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const onLoad = () => {
      metadataCache.recordThumbnailSuccess(identifier, thumbnailUrl);
      cleanup();
      resolve(thumbnailUrl);
    };

    const onError = () => {
      metadataCache.recordThumbnailFailure(identifier);
      cleanup();
      reject(new Error(`Thumbnail load failed: ${thumbnailUrl}`));
    };

    const onAbort = () => {
      cleanup();
      reject(new Error('Thumbnail load aborted'));
    };

    const cleanup = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      signal?.removeEventListener('abort', onAbort);
    };

    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', onAbort);
      if (signal.aborted) {
        onAbort();
        return;
      }
    }

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    img.src = thumbnailUrl;
  });
}

// Popular search queries for pre-caching
const POPULAR_QUERIES = [
  'nature documentary',
  'vintage commercial',
  'educational film',
  'newsreel',
  'cartoon animation',
  'music performance',
  'travel footage',
  'science experiment',
  'historical events',
  'space exploration'
];

// Pre-cache popular queries to improve search performance
let precacheTimer: NodeJS.Timeout | null = null;
let precacheIndex = 0;

export function queuePopularQueryPrecache(userQuery: string): void {
  // Clear existing precache timer
  if (precacheTimer) {
    clearTimeout(precacheTimer);
  }
  
  // Wait 5 seconds after user stops typing to start precaching
  precacheTimer = setTimeout(() => {
    precachePopularQueries(userQuery);
  }, 5000);
}

async function precachePopularQueries(excludeQuery?: string): Promise<void> {
  try {
    // Find queries similar to user's search or use popular ones
    const querySet = new Set(POPULAR_QUERIES);
    
    // Add variations of the user's query
    if (excludeQuery && excludeQuery.length > 3) {
      const words = excludeQuery.toLowerCase().split(' ');
      if (words.length === 1) {
        // Add common combinations with single words
        querySet.add(`${words[0]} documentary`);
        querySet.add(`vintage ${words[0]}`);
        querySet.add(`${words[0]} history`);
      }
    }
    
    const queries = Array.from(querySet).filter(q => q !== excludeQuery);
    
    // Precache 3 queries maximum to avoid overwhelming Archive.org
    for (let i = 0; i < Math.min(3, queries.length); i++) {
      const queryIndex = (precacheIndex + i) % queries.length;
      const query = queries[queryIndex];
      
      // Check if already cached
      const cacheKey = JSON.stringify({ query, page: 1 });
      const cached = metadataCache.get(cacheKey, 1);
      
      if (!cached) {
        console.log(`🔮 Pre-caching popular query: "${query}"`);
        
        try {
          // Use a minimal search to warm the cache
          await searchVideos({
            query,
            page: 1,
            yearFrom: '',
            yearTo: '',
            duration: 'all',
            license: 'all',
            sort: 'relevance',
            sources: [],
            allowRestrictedLicenses: false
          });
          
          // Small delay between precache requests
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          // Don't log precache errors as they're not user-facing
          console.debug(`Precache failed for "${query}":`, error);
        }
      }
    }
    
    // Update index for next precache cycle
    precacheIndex = (precacheIndex + 3) % queries.length;
    
  } catch (error) {
    console.debug('Precache operation failed:', error);
  }
}
