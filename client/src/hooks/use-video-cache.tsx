import { useState, useEffect } from 'react';
import { getVideoUrl, pollJobStatus } from '@/lib/archive-api';

export interface VideoCacheState {
  url: string | null;
  cached: boolean;
  warming: boolean;
  progress: number;
  status: string;
  jobId?: string;
  error?: string;
}

export function useVideoCache(identifier: string | null) {
  const [state, setState] = useState<VideoCacheState>({
    url: null,
    cached: false,
    warming: false,
    progress: 0,
    status: 'idle'
  });

  const [isLoading, setIsLoading] = useState(false);

  const loadVideo = async (id: string) => {
    if (!id) return;
    
    setIsLoading(true);
    setState(prev => ({ ...prev, error: undefined }));

    try {
      console.log(`🎯 Loading video: ${id}`);
      const result = await getVideoUrl(id);

      setState({
        url: result.url,
        cached: result.cached,
        warming: result.warming || false,
        progress: result.progress || 0,
        status: result.warming ? 'warming' : (result.cached ? 'cached' : 'direct'),
        jobId: result.jobId,
        error: undefined
      });

      // If warming, start polling for updates
      if (result.warming && result.jobId) {
        console.log(`⏳ Video warming, polling job: ${result.jobId}`);
        
        pollJobStatus(
          result.jobId,
          (progress, status) => {
            setState(prev => ({
              ...prev,
              progress,
              status: status === 'completed' ? 'cached' : 'warming'
            }));
          },
          2000
        )
        .then(() => {
          // When complete, get the new cached URL
          console.log(`✅ Transcoding complete for ${id}`);
          return getVideoUrl(id);
        })
        .then((updatedResult) => {
          setState({
            url: updatedResult.url,
            cached: true,
            warming: false,
            progress: 100,
            status: 'cached',
            error: undefined
          });
        })
        .catch((error) => {
          console.error('Polling failed:', error);
          setState(prev => ({
            ...prev,
            warming: false,
            status: 'direct',
            error: error.message
          }));
        });
      }

    } catch (error) {
      console.error(`Failed to load video ${id}:`, error);
      setState({
        url: null,
        cached: false,
        warming: false,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load video when identifier changes
  useEffect(() => {
    if (identifier) {
      loadVideo(identifier);
    } else {
      setState({
        url: null,
        cached: false,
        warming: false,
        progress: 0,
        status: 'idle'
      });
    }
  }, [identifier]);

  return {
    ...state,
    isLoading,
    reload: () => identifier && loadVideo(identifier)
  };
}