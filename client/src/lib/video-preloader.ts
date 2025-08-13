import { type QueueItem } from '@/lib/types';
import { connectionMonitor } from '@/lib/connection-monitor';

interface PreloadCache {
  [videoUrl: string]: {
    element: HTMLVideoElement;
    loaded: boolean;
    loading: boolean;
    error: boolean;
    retryCount: number;
  };
}

class VideoPreloader {
  private cache: PreloadCache = {};
  private maxCacheSize = 5; // Increased cache size for better performance
  private maxRetries = 2; // Reduced retries to fail faster
  private currentAbortController: AbortController | null = null;
  private preloadTimeout = 30000; // 30 second timeout for preloads
  private userBehavior: { [videoId: string]: number } = {}; // Track video view counts
  private lastSearchQuery = '';
  private searchBasedPreloads: string[] = []; // URLs from recent searches

  // Preload the next video in the queue with adaptive strategy
  async preloadNext(queueItems: QueueItem[], currentIndex: number): Promise<void> {
    const settings = connectionMonitor.getSettings();
    
    // Adjust preload count based on connection quality
    const maxPreloads = Math.min(settings.maxConcurrentStreams, queueItems.length - currentIndex - 1);
    const videosToPreload: number[] = [];
    
    // Smart prioritization: next videos + popular videos
    for (let i = 1; i <= maxPreloads; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < queueItems.length) {
        videosToPreload.push(nextIndex);
      }
    }
    
    // Add predictive preloads based on user behavior
    if (settings.preloadStrategy === 'auto') {
      this.addPredictivePreloads(queueItems, videosToPreload);
    }
    
    for (const nextIndex of videosToPreload) {
      if (nextIndex >= queueItems.length) continue;
      
      const nextItem = queueItems[nextIndex];
      if (!nextItem?.videoUrl) continue;
      
      // Skip if already preloaded or loading
      if (this.isPreloaded(nextItem.videoUrl) || this.isLoading(nextItem.videoUrl)) {
        continue;
      }

      try {
        // Use a separate abort controller for each preload
        const abortController = new AbortController();
        
        // Only preload if connection allows it
        if (settings.preloadStrategy !== 'none') {
          this.preloadVideo(nextItem.videoUrl, abortController.signal);
        }
        
        // Clean up cache if getting too large
        this.cleanupCache();
        
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn(`Video preload failed for index ${nextIndex}:`, error);
        }
      }
    }
  }

  private addPredictivePreloads(queueItems: QueueItem[], currentPreloads: number[]): void {
    // Find videos user has watched before (predictive loading)
    const watchedVideos = Object.keys(this.userBehavior)
      .sort((a, b) => this.userBehavior[b] - this.userBehavior[a])
      .slice(0, 3); // Top 3 most watched
      
    for (const videoId of watchedVideos) {
      const index = queueItems.findIndex(item => item.identifier === videoId);
      if (index > -1 && !currentPreloads.includes(index)) {
        currentPreloads.push(index);
        break; // Only add one predictive preload
      }
    }
  }

  // Track user behavior for predictive preloading
  public trackVideoView(videoId: string): void {
    this.userBehavior[videoId] = (this.userBehavior[videoId] || 0) + 1;
    
    // Keep only last 50 entries to prevent memory bloat
    const entries = Object.entries(this.userBehavior);
    if (entries.length > 50) {
      const sorted = entries.sort(([,a], [,b]) => b - a);
      this.userBehavior = Object.fromEntries(sorted.slice(0, 50));
    }
  }

  // Cache search results for predictive preloading
  public cacheSearchResults(query: string, results: any[]): void {
    if (query !== this.lastSearchQuery) {
      this.lastSearchQuery = query;
      this.searchBasedPreloads = results
        .slice(0, 5) // Top 5 search results
        .map(result => result.videoUrl || `/api/video/${result.identifier}`)
        .filter(Boolean);
    }
  }

  // Preload a specific video
  private async preloadVideo(videoUrl: string, signal?: AbortSignal): Promise<void> {
    // Check if already in cache
    if (this.cache[videoUrl]?.loaded) {
      return;
    }

    // Check if already loading
    if (this.cache[videoUrl]?.loading) {
      return;
    }

    // Initialize cache entry
    if (!this.cache[videoUrl]) {
      this.cache[videoUrl] = {
        element: document.createElement('video'),
        loaded: false,
        loading: false,
        error: false,
        retryCount: 0
      };
    }

    const cacheEntry = this.cache[videoUrl];
    
    if (cacheEntry.error && cacheEntry.retryCount >= this.maxRetries) {
      return; // Give up after max retries
    }

    cacheEntry.loading = true;
    cacheEntry.error = false;

    return new Promise((resolve, reject) => {
      const video = cacheEntry.element;
      
      // Set up event listeners
      const onCanPlayThrough = () => {
        cacheEntry.loaded = true;
        cacheEntry.loading = false;
        cleanup();
        resolve();
      };

      const onError = () => {
        cacheEntry.loading = false;
        cacheEntry.error = true;
        cacheEntry.retryCount++;
        cleanup();
        reject(new Error(`Video preload failed: ${videoUrl}`));
      };

      const onAbort = () => {
        cacheEntry.loading = false;
        cleanup();
        reject(new Error('Video preload aborted'));
      };

      let cleanup = () => {
        video.removeEventListener('canplaythrough', onCanPlayThrough);
        video.removeEventListener('error', onError);
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

      video.addEventListener('canplaythrough', onCanPlayThrough);
      video.addEventListener('error', onError);

      // Configure video element for optimal preloading
      video.preload = 'metadata'; // Changed from 'auto' to 'metadata' for faster initial load
      video.muted = true; // Required for autoplay policies
      video.crossOrigin = 'anonymous';
      video.playsInline = true; // Better mobile performance
      
      // Add timeout to prevent hanging preloads
      const timeoutId = setTimeout(() => {
        cacheEntry.loading = false;
        cacheEntry.error = true;
        cleanup();
        reject(new Error(`Video preload timeout: ${videoUrl}`));
      }, this.preloadTimeout);
      
      // Create enhanced cleanup function with timeout clearing
      const originalCleanup = cleanup;
      cleanup = () => {
        clearTimeout(timeoutId);
        originalCleanup();
      };
      
      // Start preload
      video.src = videoUrl;
      video.load();
    });
  }

  // Get preloaded video element
  getPreloadedVideo(videoUrl: string): HTMLVideoElement | null {
    const cacheEntry = this.cache[videoUrl];
    return cacheEntry?.loaded ? cacheEntry.element : null;
  }

  // Check if video is preloaded
  isPreloaded(videoUrl: string): boolean {
    return this.cache[videoUrl]?.loaded || false;
  }

  // Check if video is currently loading
  isLoading(videoUrl: string): boolean {
    return this.cache[videoUrl]?.loading || false;
  }

  // Cancel current preload operation
  cancelCurrentPreload(): void {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
  }

  // Clean up old cache entries
  cleanupCache(): void {
    const entries = Object.entries(this.cache);
    
    if (entries.length <= this.maxCacheSize) return;

    // Sort by last used (we'll implement LRU later if needed)
    // For now, just remove oldest entries
    const toRemove = entries
      .filter(([_, entry]) => !entry.loading)
      .slice(0, entries.length - this.maxCacheSize);

    toRemove.forEach(([url, entry]) => {
      // Clean up video element
      entry.element.src = '';
      entry.element.load();
      delete this.cache[url];
    });
  }

  // Clear all cache
  clearCache(): void {
    this.cancelCurrentPreload();
    
    Object.values(this.cache).forEach(entry => {
      entry.element.src = '';
      entry.element.load();
    });
    
    this.cache = {};
  }

  // Get cache status for debugging
  getCacheStatus(): { [url: string]: { loaded: boolean; loading: boolean; error: boolean; retryCount: number } } {
    return Object.fromEntries(
      Object.entries(this.cache).map(([url, entry]) => [
        url,
        {
          loaded: entry.loaded,
          loading: entry.loading,
          error: entry.error,
          retryCount: entry.retryCount
        }
      ])
    );
  }
}

// Global preloader instance
export const videoPreloader = new VideoPreloader();