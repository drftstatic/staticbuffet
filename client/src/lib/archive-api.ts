import { type SearchFilters, type Video } from "@shared/schema";
import { type SearchState } from "./types";
import { metadataCache } from './metadata-cache';

// Global abort controller for cancelling requests
let currentSearchController: AbortController | null = null;

export async function searchVideos(filters: SearchState) {
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
  
  if (filters.query) params.set('query', filters.query);
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
  
  // Set default rows if not specified
  params.set('rows', '50');

  const response = await fetch(`/api/search?${params.toString()}`, {
    signal: currentSearchController.signal
  });
  
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  // Cache the results
  if (result.docs && result.docs.length > 0) {
    metadataCache.set(cacheKey, filters.page || 1, result.docs, result.numFound || 0);
  }
  
  return result;
}

export async function getVideoMetadata(identifier: string) {
  const response = await fetch(`/api/metadata/${identifier}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get metadata: ${response.statusText}`);
  }
  
  return response.json();
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
