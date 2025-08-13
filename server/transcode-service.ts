import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface TranscodeJob {
  id: string;
  identifier: string;
  sourceUrl: string;
  status: 'pending' | 'downloading' | 'transcoding' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  outputPaths: {
    mp4?: string;
    hls?: string;
    dash?: string;
  };
}

export interface TranscodeOptions {
  createHLS?: boolean;
  createDASH?: boolean;
  videoCodec?: string;
  audioCodec?: string;
  videoBitrate?: string;
  audioBitrate?: string;
  resolution?: string;
}

class TranscodeService {
  private jobs = new Map<string, TranscodeJob>();
  private cacheDir: string;
  private processingQueue: string[] = [];
  private isProcessing = false;

  constructor() {
    this.cacheDir = process.env.VIDEO_CACHE_DIR || path.join(process.cwd(), 'video-cache');
    this.ensureCacheDir();
  }

  private async ensureCacheDir() {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
      await fs.mkdir(path.join(this.cacheDir, 'mp4'), { recursive: true });
      await fs.mkdir(path.join(this.cacheDir, 'hls'), { recursive: true });
      await fs.mkdir(path.join(this.cacheDir, 'dash'), { recursive: true });
    } catch (error) {
      console.error('Failed to create cache directories:', error);
    }
  }

  /**
   * Check if FFmpeg is available
   */
  async checkFFmpeg(): Promise<boolean> {
    return new Promise((resolve) => {
      const ffmpeg = spawn('ffmpeg', ['-version']);
      ffmpeg.on('error', () => resolve(false));
      ffmpeg.on('close', (code) => resolve(code === 0));
    });
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(identifier: string): string {
    const timestamp = Date.now();
    const hash = crypto.createHash('md5').update(`${identifier}-${timestamp}`).digest('hex').substring(0, 8);
    return `${identifier}-${hash}`;
  }

  /**
   * Check if video is already cached
   */
  async isCached(identifier: string): Promise<{
    cached: boolean;
    mp4Path?: string;
    hlsPath?: string;
    dashPath?: string;
  }> {
    const mp4Path = path.join(this.cacheDir, 'mp4', `${identifier}.mp4`);
    const hlsPath = path.join(this.cacheDir, 'hls', identifier, 'playlist.m3u8');
    const dashPath = path.join(this.cacheDir, 'dash', identifier, 'manifest.mpd');

    try {
      const [mp4Exists, hlsExists, dashExists] = await Promise.all([
        fs.access(mp4Path).then(() => true).catch(() => false),
        fs.access(hlsPath).then(() => true).catch(() => false),
        fs.access(dashPath).then(() => true).catch(() => false),
      ]);

      return {
        cached: mp4Exists || hlsExists || dashExists,
        mp4Path: mp4Exists ? mp4Path : undefined,
        hlsPath: hlsExists ? hlsPath : undefined,
        dashPath: dashExists ? dashPath : undefined,
      };
    } catch (error) {
      return { cached: false };
    }
  }

  /**
   * Enqueue a transcoding job
   */
  async enqueueJob(
    identifier: string, 
    sourceUrl: string, 
    options: TranscodeOptions = {}
  ): Promise<string> {
    const jobId = this.generateJobId(identifier);
    
    const job: TranscodeJob = {
      id: jobId,
      identifier,
      sourceUrl,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      outputPaths: {},
    };

    this.jobs.set(jobId, job);
    this.processingQueue.push(jobId);

    console.log(`📋 Enqueued transcoding job: ${jobId} for ${identifier}`);

    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }

    return jobId;
  }

  /**
   * Get job status
   */
  getJob(jobId: string): TranscodeJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get jobs by identifier
   */
  getJobsByIdentifier(identifier: string): TranscodeJob[] {
    return Array.from(this.jobs.values()).filter(job => job.identifier === identifier);
  }

  /**
   * Process the job queue
   */
  private async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.processingQueue.length > 0) {
      const jobId = this.processingQueue.shift()!;
      const job = this.jobs.get(jobId);

      if (!job) continue;

      try {
        await this.processJob(job);
      } catch (error) {
        console.error(`❌ Job ${jobId} failed:`, error);
        job.status = 'failed';
        job.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    this.isProcessing = false;
  }

  /**
   * Process a single job
   */
  private async processJob(job: TranscodeJob) {
    console.log(`🔄 Processing job: ${job.id}`);

    // Update status to downloading
    job.status = 'downloading';
    job.progress = 0;

    // Download the source file
    const tempInputPath = path.join(this.cacheDir, `temp_${job.id}_input`);
    
    try {
      await this.downloadFile(job.sourceUrl, tempInputPath, (progress) => {
        job.progress = Math.floor(progress * 30); // 30% for download
      });

      // Update status to transcoding
      job.status = 'transcoding';

      // Transcode to MP4
      const mp4Path = path.join(this.cacheDir, 'mp4', `${job.identifier}.mp4`);
      await this.transcodeToMP4(tempInputPath, mp4Path, (progress) => {
        job.progress = 30 + Math.floor(progress * 50); // 50% for MP4
      });

      job.outputPaths.mp4 = mp4Path;
      
      // Create HLS if requested (optional enhancement)
      // This can be expanded based on ancient codec detection
      const shouldCreateHLS = await this.shouldCreateHLS(tempInputPath);
      if (shouldCreateHLS) {
        const hlsDir = path.join(this.cacheDir, 'hls', job.identifier);
        await fs.mkdir(hlsDir, { recursive: true });
        
        await this.transcodeToHLS(tempInputPath, hlsDir, (progress) => {
          job.progress = 80 + Math.floor(progress * 20); // 20% for HLS
        });
        
        job.outputPaths.hls = path.join(hlsDir, 'playlist.m3u8');
      }

      // Clean up temp file
      await fs.unlink(tempInputPath);

      job.status = 'completed';
      job.progress = 100;
      job.completedAt = new Date();

      console.log(`✅ Job completed: ${job.id}`);

    } catch (error) {
      // Clean up temp file on error
      try {
        await fs.unlink(tempInputPath);
      } catch {}
      
      throw error;
    }
  }

  /**
   * Download file with progress
   */
  private async downloadFile(url: string, outputPath: string, onProgress?: (progress: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            reject(new Error(`Download failed: ${response.status} ${response.statusText}`));
            return;
          }

          const totalSize = parseInt(response.headers.get('content-length') || '0');
          let downloadedSize = 0;

          const fileStream = await fs.open(outputPath, 'w');
          const writer = fileStream.createWriteStream();

          if (!response.body) {
            reject(new Error('No response body'));
            return;
          }

          const reader = response.body.getReader();

          const pump = async (): Promise<void> => {
            try {
              const { done, value } = await reader.read();
              if (done) {
                await writer.end();
                await fileStream.close();
                resolve();
                return;
              }

              downloadedSize += value.length;
              writer.write(Buffer.from(value));

              if (onProgress && totalSize > 0) {
                onProgress(downloadedSize / totalSize);
              }

              return pump();
            } catch (error) {
              await writer.destroy();
              await fileStream.close();
              reject(error);
            }
          };

          return pump();
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Transcode to MP4 using FFmpeg
   */
  private async transcodeToMP4(inputPath: string, outputPath: string, onProgress?: (progress: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const args = [
        '-i', inputPath,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-y', // Overwrite output
        outputPath
      ];

      const ffmpeg = spawn('ffmpeg', args);

      let duration = 0;

      ffmpeg.stderr.on('data', (data) => {
        const output = data.toString();
        
        // Parse duration
        const durationMatch = output.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
        if (durationMatch) {
          const [, hours, minutes, seconds] = durationMatch;
          duration = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
        }

        // Parse progress
        const timeMatch = output.match(/time=(\d+):(\d+):(\d+\.\d+)/);
        if (timeMatch && duration > 0) {
          const [, hours, minutes, seconds] = timeMatch;
          const currentTime = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
          const progress = Math.min(currentTime / duration, 1.0);
          
          if (onProgress) {
            onProgress(progress);
          }
        }
      });

      ffmpeg.on('error', reject);
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });
    });
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    jobsInQueue: number;
    activeJobs: number;
  }> {
    try {
      const mp4Dir = path.join(this.cacheDir, 'mp4');
      const files = await fs.readdir(mp4Dir);
      
      let totalSize = 0;
      for (const file of files) {
        try {
          const stats = await fs.stat(path.join(mp4Dir, file));
          totalSize += stats.size;
        } catch {}
      }

      const activeJobs = Array.from(this.jobs.values()).filter(
        job => job.status === 'downloading' || job.status === 'transcoding'
      ).length;

      return {
        totalFiles: files.length,
        totalSize,
        jobsInQueue: this.processingQueue.length,
        activeJobs,
      };
    } catch (error) {
      return {
        totalFiles: 0,
        totalSize: 0,
        jobsInQueue: this.processingQueue.length,
        activeJobs: 0,
      };
    }
  }

  /**
   * Check if we should create HLS for better compatibility
   */
  private async shouldCreateHLS(inputPath: string): Promise<boolean> {
    return new Promise((resolve) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        inputPath
      ]);

      let output = '';
      ffprobe.stdout.on('data', (data) => {
        output += data.toString();
      });

      ffprobe.on('close', (code) => {
        if (code !== 0) {
          resolve(false);
          return;
        }

        try {
          const info = JSON.parse(output);
          const videoStream = info.streams?.find((s: any) => s.codec_type === 'video');
          
          // Create HLS for ancient codecs or very large files
          const isAncientCodec = videoStream && ![
            'h264', 'h.264', 'avc1', 'mp4v', 'libx264'
          ].includes(videoStream.codec_name?.toLowerCase());
          
          const isLargeFile = info.format?.size && parseInt(info.format.size) > 100 * 1024 * 1024; // 100MB
          
          resolve(isAncientCodec || isLargeFile || false);
        } catch (error) {
          resolve(false);
        }
      });

      ffprobe.on('error', () => resolve(false));
    });
  }

  /**
   * Transcode to HLS for better streaming
   */
  private async transcodeToHLS(inputPath: string, outputDir: string, onProgress?: (progress: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const playlistPath = path.join(outputDir, 'playlist.m3u8');
      
      const args = [
        '-i', inputPath,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-f', 'hls',
        '-hls_time', '6',
        '-hls_playlist_type', 'vod',
        '-hls_segment_filename', path.join(outputDir, 'segment_%03d.ts'),
        '-y', // Overwrite output
        playlistPath
      ];

      const ffmpeg = spawn('ffmpeg', args);
      let duration = 0;

      ffmpeg.stderr.on('data', (data) => {
        const output = data.toString();
        
        // Parse duration
        const durationMatch = output.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
        if (durationMatch) {
          const [, hours, minutes, seconds] = durationMatch;
          duration = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
        }

        // Parse progress
        const timeMatch = output.match(/time=(\d+):(\d+):(\d+\.\d+)/);
        if (timeMatch && duration > 0) {
          const [, hours, minutes, seconds] = timeMatch;
          const currentTime = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
          const progress = Math.min(currentTime / duration, 1.0);
          
          if (onProgress) {
            onProgress(progress);
          }
        }
      });

      ffmpeg.on('error', reject);
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`HLS transcoding failed with code ${code}`));
        }
      });
    });
  }

  clearOldJobs(hoursOld: number = 24) {
    const cutoff = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
    const jobsToDelete: string[] = [];

    for (const [jobId, job] of Array.from(this.jobs.entries())) {
      if (job.status === 'completed' && job.completedAt && job.completedAt < cutoff) {
        jobsToDelete.push(jobId);
      }
    }

    for (const jobId of jobsToDelete) {
      this.jobs.delete(jobId);
    }
  }
}

// Export singleton instance
export const transcodeService = new TranscodeService();

// Periodic cleanup
setInterval(() => {
  transcodeService.clearOldJobs(24);
}, 60 * 60 * 1000); // Every hour