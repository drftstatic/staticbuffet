import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Info
} from 'lucide-react';

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  responseTime: number | null;
  lastChecked: Date;
  message?: string;
}

interface ServiceStatusProps {
  className?: string;
  compact?: boolean;
}

export function ServiceStatus({ className = '', compact = false }: ServiceStatusProps) {
  const [archiveStatus, setArchiveStatus] = useState<ServiceHealth>({
    status: 'unknown',
    responseTime: null,
    lastChecked: new Date(),
  });
  const [lastSearchError, setLastSearchError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkArchiveOrgStatus = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      // Test a simple search to check if Archive.org is responsive
      const response = await fetch('/api/search?query=test&rows=1', {
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        setArchiveStatus({
          status: responseTime > 8000 ? 'degraded' : 'healthy',
          responseTime,
          lastChecked: new Date(),
          message: responseTime > 8000 ? 'Archive.org is responding slowly' : undefined
        });
        setLastSearchError(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setArchiveStatus({
          status: response.status === 429 ? 'degraded' : 'down',
          responseTime,
          lastChecked: new Date(),
          message: errorData.error || `HTTP ${response.status}`
        });
        
        if (response.status !== 429) {
          setLastSearchError(`Archive.org returned ${response.status}`);
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setArchiveStatus({
        status: 'down',
        responseTime,
        lastChecked: new Date(),
        message: error instanceof Error ? error.message : 'Connection failed'
      });
      setLastSearchError('Cannot connect to Archive.org');
    } finally {
      setIsChecking(false);
    }
  };

  // Check status on mount and periodically
  useEffect(() => {
    checkArchiveOrgStatus();
    
    // Check every 5 minutes
    const interval = setInterval(checkArchiveOrgStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={14} className="text-green-600" />;
      case 'degraded': return <AlertTriangle size={14} className="text-yellow-600" />;
      case 'down': return <WifiOff size={14} className="text-red-600" />;
      default: return <Clock size={14} className="text-gray-600" />;
    }
  };

  const getStatusText = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy': return 'Archive.org is running smoothly';
      case 'degraded': return 'Archive.org is experiencing some delays';
      case 'down': return 'Archive.org is having issues';
      default: return 'Checking Archive.org status...';
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon(archiveStatus.status)}
        <Badge variant="outline" className={`text-xs ${getStatusColor(archiveStatus.status)}`}>
          {archiveStatus.status === 'healthy' ? '✓' : 
           archiveStatus.status === 'degraded' ? '⚠' : 
           archiveStatus.status === 'down' ? '✗' : '?'} Archive.org
        </Badge>
        {archiveStatus.responseTime && (
          <span className="text-xs text-gray-500">
            {archiveStatus.responseTime}ms
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Service Status Overview */}
      <Alert className={getStatusColor(archiveStatus.status)}>
        <div className="flex items-start space-x-3">
          {getStatusIcon(archiveStatus.status)}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Archive.org Service Status</h4>
              <Button
                onClick={checkArchiveOrgStatus}
                disabled={isChecking}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
              >
                {isChecking ? (
                  <>
                    <Clock size={10} className="mr-1 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>
            
            <AlertDescription className="text-sm mt-1">
              {getStatusText(archiveStatus.status)}
              {archiveStatus.message && (
                <span className="block text-xs mt-1 opacity-80">
                  {archiveStatus.message}
                </span>
              )}
            </AlertDescription>
            
            <div className="flex items-center space-x-4 text-xs opacity-70 mt-2">
              {archiveStatus.responseTime && (
                <span>Response: {archiveStatus.responseTime}ms</span>
              )}
              <span>Last checked: {archiveStatus.lastChecked.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </Alert>

      {/* Educational Information */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info size={14} className="text-blue-600" />
        <AlertDescription className="text-sm text-blue-800">
          <div className="space-y-2">
            <p>
              <strong>About Our Service:</strong> Static Buffet searches Archive.org's vast collection 
              of public domain videos, including content from libraries, museums, and archives worldwide.
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <a 
                href="https://archive.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink size={10} className="mr-1" />
                Visit Archive.org
              </a>
              <span>• Free service with occasional delays</span>
              <span>• Millions of videos available</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Recent Error Information */}
      {lastSearchError && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle size={14} className="text-orange-600" />
          <AlertDescription className="text-sm text-orange-800">
            <strong>Recent Issue:</strong> {lastSearchError}
            <br />
            <span className="text-xs opacity-80">
              This is usually temporary. Archive.org experiences high traffic during peak hours.
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}