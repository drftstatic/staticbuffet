import { type QueueItem } from '@/lib/types';

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
  private maxCacheSize = 3; // Preload up to 3 videos
  private maxRetries = 3;
  private currentAbortController: AbortController | null = null;

  // Preload the next video in the queue
  async preloadNext(queueItems: QueueItem[], currentIndex: number): Promise<void> {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= queueItems.length) return;

    const nextItem = queueItems[nextIndex];
    if (!nextItem?.videoUrl) return;

    // Cancel any existing preload
    this.cancelCurrentPreload();

    // Create new abort controller for this preload
    this.currentAbortController = new AbortController();

    try {
      await this.preloadVideo(nextItem.videoUrl, this.currentAbortController.signal);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.warn('Video preload failed:', error);
      }
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

      const cleanup = () => {
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

      // Configure video element
      video.preload = 'auto';
      video.muted = true; // Required for autoplay policies
      video.crossOrigin = 'anonymous';
      
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