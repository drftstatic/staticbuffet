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

  // Add client-side retry logic with exponential backoff
  let lastError;
  let result;
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🔍 Client search attempt ${attempt}/2 - URL: /api/search?${params.toString()}`);
      
      const response = await fetch(`/api/search?${params.toString()}`, {
        signal: currentSearchController.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // Check for rate limiting
        if (response.status === 429) {
          throw new Error('Rate limited - please wait a moment before searching again');
        }
        
        let errorDetail = '';
        try {
          const errorData = await response.json();
          errorDetail = errorData.error || errorData.message || '';
        } catch {
          errorDetail = await response.text();
        }
        
        console.error(`❌ Client search failed: ${response.status} ${response.statusText}`, errorDetail);
        throw new Error(`Search failed: ${response.status} ${response.statusText}${errorDetail ? '. ' + errorDetail : ''}`);
      }
      
      result = await response.json();
      
      // Validate result structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format from search API');
      }
      
      console.log(`Client search successful on attempt ${attempt}, found ${result.numFound || 0} results`);
      break; // Success, exit retry loop
      
    } catch (error) {
      lastError = error;
      
      // Don't retry if the request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      
      console.error(`Client search attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
      
      if (attempt < 2) {
        // Wait before retrying (short delay for client-side retries)
        const delay = 500 * attempt;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  if (!result) {
    throw new Error(`Search failed after 2 attempts. Last error: ${lastError instanceof Error ? lastError.message : lastError}`);
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
