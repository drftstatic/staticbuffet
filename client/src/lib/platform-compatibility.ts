/**
 * Platform Compatibility Checker for Static Buffet
 * Verifies browser support for video/audio features across all platforms
 */

export interface CompatibilityReport {
  browser: string;
  videoSupport: {
    html5: boolean;
    mp4: boolean;
    webm: boolean;
    mov: boolean;
  };
  audioSupport: {
    webAudio: boolean;
    audioContext: boolean;
    mediaDevices: boolean;
    getUserMedia: boolean;
  };
  performanceFeatures: {
    requestAnimationFrame: boolean;
    performanceMemory: boolean;
    canvas: boolean;
    webGL: boolean;
  };
  overallScore: number;
}

export class PlatformCompatibilityChecker {
  static checkCompatibility(): CompatibilityReport {
    const report: CompatibilityReport = {
      browser: this.detectBrowser(),
      videoSupport: this.checkVideoSupport(),
      audioSupport: this.checkAudioSupport(),
      performanceFeatures: this.checkPerformanceFeatures(),
      overallScore: 0
    };

    // Calculate overall compatibility score (0-100)
    const scores = [
      report.videoSupport.html5 ? 25 : 0,
      report.videoSupport.mp4 ? 15 : 0,
      report.videoSupport.webm ? 10 : 0,
      report.audioSupport.webAudio ? 20 : 0,
      report.audioSupport.getUserMedia ? 15 : 0,
      report.performanceFeatures.requestAnimationFrame ? 10 : 0,
      report.performanceFeatures.canvas ? 5 : 0
    ];
    
    report.overallScore = scores.reduce((sum, score) => sum + score, 0);
    
    return report;
  }

  private static detectBrowser(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  }

  private static checkVideoSupport() {
    const video = document.createElement('video');
    
    return {
      html5: !!video.canPlayType,
      mp4: video.canPlayType('video/mp4') !== '',
      webm: video.canPlayType('video/webm') !== '',
      mov: video.canPlayType('video/quicktime') !== ''
    };
  }

  private static checkAudioSupport() {
    return {
      webAudio: !!(window.AudioContext || (window as any).webkitAudioContext),
      audioContext: !!window.AudioContext,
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!(navigator.mediaDevices?.getUserMedia || 
        (navigator as any).webkitGetUserMedia || 
        (navigator as any).mozGetUserMedia)
    };
  }

  private static checkPerformanceFeatures() {
    return {
      requestAnimationFrame: !!window.requestAnimationFrame,
      performanceMemory: 'memory' in performance,
      canvas: !!document.createElement('canvas').getContext,
      webGL: !!document.createElement('canvas').getContext('webgl')
    };
  }

  static getOptimizationRecommendations(report: CompatibilityReport): string[] {
    const recommendations: string[] = [];

    if (report.overallScore < 60) {
      recommendations.push('Consider upgrading to a modern browser for optimal performance');
    }

    if (!report.videoSupport.mp4) {
      recommendations.push('MP4 video support missing - some videos may not play');
    }

    if (!report.audioSupport.webAudio) {
      recommendations.push('Web Audio API not supported - audio effects will be limited');
    }

    if (!report.audioSupport.getUserMedia) {
      recommendations.push('Microphone access not available - audio-reactive features disabled');
    }

    if (!report.performanceFeatures.requestAnimationFrame) {
      recommendations.push('Animation performance may be reduced');
    }

    if (report.browser === 'Safari') {
      recommendations.push('Safari detected - ensure autoplay policies are configured correctly');
    }

    return recommendations;
  }

  /**
   * Optimized video format selection based on browser capabilities
   */
  static selectOptimalVideoFormat(availableFormats: string[], report?: CompatibilityReport): string | null {
    const compat = report || this.checkCompatibility();
    
    // Priority order: MP4 > WebM > MOV
    const formatPriority = [
      { ext: 'mp4', supported: compat.videoSupport.mp4 },
      { ext: 'webm', supported: compat.videoSupport.webm },
      { ext: 'mov', supported: compat.videoSupport.mov }
    ];

    for (const format of formatPriority) {
      if (format.supported) {
        const matchingFile = availableFormats.find(file => 
          file.toLowerCase().includes(`.${format.ext}`)
        );
        if (matchingFile) return matchingFile;
      }
    }

    return null; // No compatible format found
  }

  /**
   * Performance monitoring for video playback
   */
  static monitorVideoPerformance(videoElement: HTMLVideoElement): Promise<{
    loadTime: number;
    firstFrame: number;
    droppedFrames: number;
  }> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      let firstFrameTime = 0;

      const handleCanPlay = () => {
        const loadTime = performance.now() - startTime;
        
        const handleLoadedData = () => {
          firstFrameTime = performance.now() - startTime;
          
          // Monitor for 5 seconds to check dropped frames
          setTimeout(() => {
            const droppedFrames = (videoElement as any).webkitDroppedFrameCount || 0;
            
            resolve({
              loadTime,
              firstFrame: firstFrameTime,
              droppedFrames
            });
          }, 5000);
        };

        videoElement.addEventListener('loadeddata', handleLoadedData, { once: true });
      };

      videoElement.addEventListener('canplay', handleCanPlay, { once: true });
    });
  }
}

// Export singleton instance for easy usage
export const CompatibilityChecker = PlatformCompatibilityChecker;