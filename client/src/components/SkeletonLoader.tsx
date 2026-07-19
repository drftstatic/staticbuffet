import { useStore } from '@/lib/store';
interface SkeletonLoaderProps {
    variant?: 'card' | 'thumbnail' | 'text' | 'video';
    className?: string;
    count?: number;
}
export function SkeletonLoader({ variant = 'card', className = '', count = 1 }: SkeletonLoaderProps) {
    const { brandSkin } = useStore();
    const getThemeClasses = () => {
        {
            return 'bg-lime-200/20 animate-pulse';
        }
    };
    const themeClass = getThemeClasses();
    const renderSkeleton = () => {
        switch (variant) {
            case 'card':
                return (<div className={`rounded-lg border border-gray-300/50 overflow-hidden ${className}`}>
            {/* Thumbnail skeleton */}
            <div className={`aspect-video ${themeClass}`}/>
            
            {/* Content skeleton */}
            <div className="p-3 space-y-2">
              {/* Title lines */}
              <div className={`h-4 ${themeClass} rounded`}/>
              <div className={`h-3 ${themeClass} rounded w-3/4`}/>
              
              {/* Metadata line */}
              <div className="flex items-center justify-between mt-3">
                <div className={`h-3 ${themeClass} rounded w-1/4`}/>
                <div className={`h-3 ${themeClass} rounded w-1/3`}/>
              </div>
            </div>
          </div>);
            case 'thumbnail':
                return (<div className={`aspect-video rounded ${themeClass} ${className}`}/>);
            case 'text':
                return (<div className={`h-4 ${themeClass} rounded ${className}`}/>);
            case 'video':
                return (<div className={`w-full h-full rounded-lg ${themeClass} ${className}`}>
            <div className="flex items-center justify-center h-full">
              <div className={`w-16 h-16 rounded-full ${themeClass}`}/>
            </div>
          </div>);
            default:
                return <div className={`${themeClass} rounded ${className}`}/>;
        }
    };
    if (count === 1) {
        return renderSkeleton();
    }
    return (<>
      {Array.from({ length: count }, (_, index) => (<div key={index}>
          {renderSkeleton()}
        </div>))}
    </>);
}
// Specific skeleton components for common use cases
export function VideoCardSkeleton({ className = '' }: {
    className?: string;
}) {
    return <SkeletonLoader variant="card" className={className}/>;
}
export function ThumbnailSkeleton({ className = '' }: {
    className?: string;
}) {
    return <SkeletonLoader variant="thumbnail" className={className}/>;
}
export function TextSkeleton({ className = '' }: {
    className?: string;
}) {
    return <SkeletonLoader variant="text" className={className}/>;
}
export function VideoPlayerSkeleton({ className = '' }: {
    className?: string;
}) {
    return <SkeletonLoader variant="video" className={className}/>;
}
// Grid skeleton for search results
export function SearchResultsSkeleton({ count = 9 }: {
    count?: number;
}) {
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <SkeletonLoader variant="card" count={count}/>
    </div>);
}
// Queue item skeleton
export function QueueItemSkeleton({ className = '' }: {
    className?: string;
}) {
    const { brandSkin } = useStore();
    const getThemeClasses = () => {
        {
            return 'bg-gray-200/30';
        }
    };
    return (<div className={`flex items-center space-x-3 p-3 rounded-lg border border-gray-300/50 ${className}`}>
      {/* Thumbnail */}
      <ThumbnailSkeleton className="w-16 h-12 flex-shrink-0"/>
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        <TextSkeleton className="h-4"/>
        <TextSkeleton className="h-3 w-3/4"/>
      </div>
      
      {/* Controls */}
      <div className="flex space-x-2">
        <div className={`w-8 h-8 rounded ${getThemeClasses()} animate-pulse`}/>
        <div className={`w-8 h-8 rounded ${getThemeClasses()} animate-pulse`}/>
      </div>
    </div>);
}
