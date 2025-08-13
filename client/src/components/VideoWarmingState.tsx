import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, Zap, CheckCircle } from 'lucide-react';
import { pollJobStatus } from '@/lib/archive-api';

interface VideoWarmingStateProps {
  identifier: string;
  jobId: string;
  initialProgress?: number;
  initialStatus?: string;
  onComplete?: () => void;
  className?: string;
}

export function VideoWarmingState({
  identifier,
  jobId,
  initialProgress = 0,
  initialStatus = 'pending',
  onComplete,
  className = ''
}: VideoWarmingStateProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [status, setStatus] = useState(initialStatus);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const handleProgress = (newProgress: number, newStatus: string) => {
      setProgress(newProgress);
      setStatus(newStatus);

      // Estimate time remaining
      if (newProgress > 0 && newProgress < 100) {
        const elapsed = Date.now() - startTime;
        const totalEstimated = (elapsed / newProgress) * 100;
        const remaining = totalEstimated - elapsed;
        
        if (remaining > 0) {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setTimeRemaining(minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`);
        }
      }
    };

    // Start polling
    pollJobStatus(jobId, handleProgress, 1500)
      .then(() => {
        setProgress(100);
        setStatus('completed');
        if (onComplete) {
          setTimeout(onComplete, 500); // Small delay to show completion
        }
      })
      .catch((error) => {
        console.error('Transcoding failed:', error);
        setStatus('failed');
      });
  }, [jobId, onComplete, startTime]);

  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          label: 'Queued',
          description: 'Waiting to start processing...',
          color: 'bg-yellow-500'
        };
      case 'downloading':
        return {
          icon: <Download className="h-4 w-4" />,
          label: 'Downloading',
          description: 'Fetching from Internet Archive...',
          color: 'bg-blue-500'
        };
      case 'transcoding':
        return {
          icon: <Zap className="h-4 w-4" />,
          label: 'Transcoding',
          description: 'Converting to optimized format...',
          color: 'bg-purple-500'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Complete',
          description: 'Video ready for streaming!',
          color: 'bg-green-500'
        };
      case 'failed':
        return {
          icon: <div className="h-4 w-4 rounded-full bg-red-500" />,
          label: 'Failed',
          description: 'Processing failed. Using fallback.',
          color: 'bg-red-500'
        };
      default:
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          label: 'Processing',
          description: 'Working on it...',
          color: 'bg-gray-500'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`p-4 bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          {statusInfo.icon}
          <Badge 
            variant="outline" 
            className={`${statusInfo.color} text-white border-transparent`}
          >
            {statusInfo.label}
          </Badge>
        </div>
        
        {timeRemaining && status !== 'completed' && status !== 'failed' && (
          <span className="text-sm text-gray-400 ml-auto">
            ~{timeRemaining} remaining
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">{statusInfo.description}</span>
          <span className="text-gray-400">{Math.round(progress)}%</span>
        </div>
        
        <Progress 
          value={progress} 
          className="h-2"
        />
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <span className="font-mono">{identifier}</span>
        {status === 'completed' && (
          <span className="text-green-400 ml-2">• Cached for instant playback</span>
        )}
        {status === 'failed' && (
          <span className="text-yellow-400 ml-2">• Streaming directly from archive</span>
        )}
      </div>
    </div>
  );
}