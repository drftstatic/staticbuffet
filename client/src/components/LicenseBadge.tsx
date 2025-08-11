import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink } from 'lucide-react';

interface LicenseBadgeProps {
  license?: string;
  className?: string;
  showTooltip?: boolean;
}

export function LicenseBadge({ license, className = '', showTooltip = true }: LicenseBadgeProps) {
  if (!license) return null;

  const getLicenseInfo = (licenseUrl: string) => {
    const url = licenseUrl.toLowerCase();
    if (url.includes('publicdomain')) {
      return {
        label: 'PD',
        fullName: 'Public Domain',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700',
        description: 'This work is in the public domain and free of known copyright restrictions.',
        url: licenseUrl
      };
    }
    if (url.includes('cc0')) {
      return {
        label: 'CC0',
        fullName: 'Creative Commons Zero',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        description: 'The creator has waived all copyright and related rights.',
        url: licenseUrl
      };
    }
    if (url.includes('by')) {
      return {
        label: 'CC-BY',
        fullName: 'Creative Commons Attribution',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 dark:border-orange-700',
        description: 'You can use this work if you provide proper attribution.',
        url: licenseUrl
      };
    }
    return {
      label: 'Other',
      fullName: 'Other License',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-300 dark:border-gray-700',
      description: 'Please review the license terms before use.',
      url: licenseUrl
    };
  };

  const licenseInfo = getLicenseInfo(license);

  const badge = (
    <span 
      className={`px-2 py-1 text-xs rounded border font-medium cursor-pointer hover:opacity-80 transition-opacity ${licenseInfo.color} ${className}`}
      data-testid={`badge-license-${licenseInfo.label.toLowerCase().replace(/\s/g, '-')}`}
    >
      {licenseInfo.label}
    </span>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <div className="space-y-2">
            <div className="font-semibold text-sm">{licenseInfo.fullName}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {licenseInfo.description}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ExternalLink size={10} />
              <a 
                href={licenseInfo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View License
              </a>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
