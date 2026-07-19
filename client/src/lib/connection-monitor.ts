interface ConnectionQuality {
  downlink: number; // Mbps
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
  rtt: number; // Round trip time in ms
  saveData: boolean;
}

interface AdaptiveSettings {
  videoQuality: 'low' | 'medium' | 'high' | 'auto';
  preloadStrategy: 'none' | 'metadata' | 'auto';
  bufferSize: number;
  maxConcurrentStreams: number;
}

class ConnectionMonitor {
  private connection: any;
  private settings: AdaptiveSettings;
  private observers: Array<(settings: AdaptiveSettings) => void> = [];

  constructor() {
    // Get connection info if available
    this.connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    // Initialize with safe defaults
    this.settings = {
      videoQuality: 'auto',
      preloadStrategy: 'metadata',
      bufferSize: 1024 * 1024, // 1MB
      maxConcurrentStreams: 2
    };

    this.updateSettings();
    this.setupEventListeners();
  }

  private updateSettings(): void {
    const quality = this.getConnectionQuality();
    
    // Adjust settings based on connection
    if (quality.effectiveType === 'slow-2g' || quality.effectiveType === '2g') {
      this.settings = {
        videoQuality: 'low',
        preloadStrategy: 'none',
        bufferSize: 256 * 1024, // 256KB
        maxConcurrentStreams: 1
      };
    } else if (quality.effectiveType === '3g') {
      this.settings = {
        videoQuality: 'medium',
        preloadStrategy: 'metadata',
        bufferSize: 512 * 1024, // 512KB
        maxConcurrentStreams: 1
      };
    } else {
      // 4G or unknown - assume good connection
      this.settings = {
        videoQuality: 'high',
        preloadStrategy: 'auto',
        bufferSize: 2 * 1024 * 1024, // 2MB
        maxConcurrentStreams: 3
      };
    }

    // Honor user's data saver preference
    if (quality.saveData) {
      this.settings.videoQuality = 'low';
      this.settings.preloadStrategy = 'none';
      this.settings.maxConcurrentStreams = 1;
    }

    // Notify observers
    this.observers.forEach(observer => observer(this.settings));
  }

  private setupEventListeners(): void {
    if (this.connection) {
      this.connection.addEventListener('change', () => {
        console.log('📶 Connection changed:', this.getConnectionQuality());
        this.updateSettings();
      });
    }

    // Monitor actual performance
    this.startPerformanceMonitoring();
  }

  private startPerformanceMonitoring(): void {
    // Monitor video loading performance and adjust accordingly
    let loadTimes: number[] = [];
    
    // Create performance observer for resource timing
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('/api/video/')) {
            const resourceEntry = entry as PerformanceResourceTiming;
            const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
            loadTimes.push(loadTime);
            
            // Keep only last 10 measurements
            if (loadTimes.length > 10) {
              loadTimes = loadTimes.slice(-10);
            }
            
            // Adjust settings based on performance
            const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
            
            if (avgLoadTime > 5000) { // Slow loading
              if (this.settings.videoQuality === 'high') {
                this.settings.videoQuality = 'medium';
                this.notifyObservers();
              }
            } else if (avgLoadTime < 2000) { // Fast loading
              if (this.settings.videoQuality === 'low') {
                this.settings.videoQuality = 'medium';
                this.notifyObservers();
              }
            }
          }
        }
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => observer(this.settings));
  }

  public getConnectionQuality(): ConnectionQuality {
    if (this.connection) {
      return {
        downlink: this.connection.downlink || 10,
        effectiveType: this.connection.effectiveType || '4g',
        rtt: this.connection.rtt || 100,
        saveData: this.connection.saveData || false
      };
    }
    
    // Fallback for browsers without connection API
    return {
      downlink: 10,
      effectiveType: '4g',
      rtt: 100,
      saveData: false
    };
  }

  public getSettings(): AdaptiveSettings {
    return { ...this.settings };
  }

  public subscribe(observer: (settings: AdaptiveSettings) => void): () => void {
    this.observers.push(observer);
    
    // Return unsubscribe function
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  // Manual override for testing
  public overrideSettings(settings: Partial<AdaptiveSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.notifyObservers();
  }
}

export const connectionMonitor = new ConnectionMonitor();