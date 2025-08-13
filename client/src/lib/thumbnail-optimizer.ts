import { connectionMonitor } from './connection-monitor';

interface ThumbnailOptions {
  size: 'small' | 'medium' | 'large';
  format: 'jpg' | 'webp';
  quality: 'low' | 'medium' | 'high';
}

interface OptimizedThumbnail {
  url: string;
  placeholder: string; // Base64 low-quality placeholder
  loaded: boolean;
}

class ThumbnailOptimizer {
  private cache = new Map<string, OptimizedThumbnail>();
  private intersectionObserver: IntersectionObserver | null = null;
  private pendingLoads = new Set<string>();

  constructor() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const identifier = entry.target.getAttribute('data-identifier');
              if (identifier) {
                this.loadThumbnail(identifier);
              }
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before entering viewport
          threshold: 0.1
        }
      );
    }
  }

  public observeThumbnail(element: HTMLElement, identifier: string): void {
    if (this.intersectionObserver) {
      element.setAttribute('data-identifier', identifier);
      this.intersectionObserver.observe(element);
    } else {
      // Fallback: load immediately if no IntersectionObserver
      this.loadThumbnail(identifier);
    }
  }

  public unobserveThumbnail(element: HTMLElement): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
    }
  }

  private async loadThumbnail(identifier: string): Promise<void> {
    // Skip if already loading or loaded
    if (this.pendingLoads.has(identifier) || this.cache.get(identifier)?.loaded) {
      return;
    }

    this.pendingLoads.add(identifier);

    try {
      const options = this.getOptimalOptions();
      const thumbnail = await this.fetchOptimizedThumbnail(identifier, options);
      
      this.cache.set(identifier, thumbnail);
      
      // Notify any waiting elements
      this.notifyThumbnailLoaded(identifier, thumbnail);
      
    } catch (error) {
      console.warn(`Failed to load thumbnail for ${identifier}:`, error);
    } finally {
      this.pendingLoads.delete(identifier);
    }
  }

  private getOptimalOptions(): ThumbnailOptions {
    const connection = connectionMonitor.getConnectionQuality();
    const settings = connectionMonitor.getSettings();

    // Adjust based on connection quality
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return {
        size: 'small',
        format: 'jpg',
        quality: 'low'
      };
    } else if (connection.effectiveType === '3g') {
      return {
        size: 'medium',
        format: 'jpg',
        quality: 'medium'
      };
    } else {
      // 4G or better - use high quality
      return {
        size: 'large',
        format: 'webp', // Better compression
        quality: 'high'
      };
    }
  }

  private async fetchOptimizedThumbnail(identifier: string, options: ThumbnailOptions): Promise<OptimizedThumbnail> {
    // Generate placeholder first (very low quality, small)
    const placeholderUrl = `https://archive.org/services/img/${identifier}?w=40&h=30&q=20`;
    const placeholder = await this.generatePlaceholder(placeholderUrl);

    // Then get the full quality thumbnail
    const sizeMap = { small: 150, medium: 300, large: 600 };
    const qualityMap = { low: 60, medium: 80, high: 95 };
    
    const size = sizeMap[options.size];
    const quality = qualityMap[options.quality];
    
    // Use Archive.org's image service with optimization parameters
    const thumbnailUrl = `https://archive.org/services/img/${identifier}?w=${size}&h=${Math.floor(size * 0.75)}&q=${quality}`;

    return {
      url: thumbnailUrl,
      placeholder,
      loaded: false
    };
  }

  private async generatePlaceholder(url: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Create a small canvas for the placeholder
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = 20;
          canvas.height = 15;
          
          if (ctx) {
            ctx.filter = 'blur(2px)';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Convert to low-quality base64
            const placeholder = canvas.toDataURL('image/jpeg', 0.3);
            resolve(placeholder);
          } else {
            resolve(''); // Fallback
          }
        } catch (error) {
          resolve(''); // Fallback on canvas errors
        }
      };
      
      img.onerror = () => resolve('');
      img.src = url;
    });
  }

  private notifyThumbnailLoaded(identifier: string, thumbnail: OptimizedThumbnail): void {
    // Dispatch custom event for components to listen to
    const event = new CustomEvent('thumbnailLoaded', {
      detail: { identifier, thumbnail }
    });
    window.dispatchEvent(event);
  }

  public getThumbnail(identifier: string): OptimizedThumbnail | null {
    return this.cache.get(identifier) || null;
  }

  public preloadThumbnails(identifiers: string[]): void {
    // Preload thumbnails for upcoming content
    const settings = connectionMonitor.getSettings();
    
    // Only preload on good connections
    if (settings.preloadStrategy === 'auto') {
      identifiers.slice(0, 10).forEach(identifier => {
        if (!this.cache.has(identifier) && !this.pendingLoads.has(identifier)) {
          this.loadThumbnail(identifier);
        }
      });
    }
  }

  public clearCache(): void {
    this.cache.clear();
    this.pendingLoads.clear();
  }

  public getCacheStats(): { size: number; pending: number } {
    return {
      size: this.cache.size,
      pending: this.pendingLoads.size
    };
  }
}

export const thumbnailOptimizer = new ThumbnailOptimizer();