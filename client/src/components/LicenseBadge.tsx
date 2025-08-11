import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink } from 'lucide-react';
import { useStore } from '@/lib/store';

interface LicenseBadgeProps {
  license?: string;
  className?: string;
  showTooltip?: boolean;
}

export function LicenseBadge({ license, className = '', showTooltip = true }: LicenseBadgeProps) {
  const { brandSkin } = useStore();
  
  if (!license) return null;

  const getThemeColors = (baseType: string) => {
    switch (brandSkin) {
      case 'waffle':
        return baseType === 'pd' 
          ? 'bg-green-200 text-green-900 border-green-400 dark:bg-green-900/30 dark:text-green-200 dark:border-green-600'
          : baseType === 'cc0'
          ? 'bg-blue-200 text-blue-900 border-blue-400 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-600'
          : baseType === 'ccby'
          ? 'bg-orange-200 text-orange-900 border-orange-400 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-600'
          : 'bg-amber-200 text-amber-900 border-amber-400 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-600';
      case 'ebn':
        return baseType === 'pd' 
          ? 'bg-lime-900/40 text-lime-300 border-lime-500 hover:bg-lime-900/60'
          : baseType === 'cc0'
          ? 'bg-cyan-900/40 text-cyan-300 border-cyan-500 hover:bg-cyan-900/60'
          : baseType === 'ccby'
          ? 'bg-purple-900/40 text-purple-300 border-purple-500 hover:bg-purple-900/60'
          : 'bg-yellow-900/40 text-yellow-300 border-yellow-500 hover:bg-yellow-900/60';
      case 'ozzy':
        return baseType === 'pd' 
          ? 'bg-green-900/50 text-green-300 border-green-500 hover:bg-green-900/70'
          : baseType === 'cc0'
          ? 'bg-blue-900/50 text-blue-300 border-blue-500 hover:bg-blue-900/70'
          : baseType === 'ccby'
          ? 'bg-red-900/50 text-red-300 border-red-500 hover:bg-red-900/70'
          : 'bg-gray-900/50 text-gray-300 border-gray-500 hover:bg-gray-900/70';
      default:
        return baseType === 'pd' 
          ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
          : baseType === 'cc0'
          ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
          : baseType === 'ccby'
          ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700'
          : 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getLicenseInfo = (licenseUrl: string) => {
    const url = licenseUrl.toLowerCase();
    if (url.includes('publicdomain')) {
      return {
        label: 'PD',
        fullName: 'Public Domain',
        color: getThemeColors('pd'),
        description: 'This work is in the public domain and free of known copyright restrictions.',
        url: licenseUrl
      };
    }
    if (url.includes('cc0')) {
      return {
        label: 'CC0',
        fullName: 'Creative Commons Zero',
        color: getThemeColors('cc0'),
        description: 'The creator has waived all copyright and related rights.',
        url: licenseUrl
      };
    }
    if (url.includes('by')) {
      return {
        label: 'CC-BY',
        fullName: 'Creative Commons Attribution',
        color: getThemeColors('ccby'),
        description: 'You can use this work if you provide proper attribution.',
        url: licenseUrl
      };
    }
    return {
      label: 'Other',
      fullName: 'Other License',
      color: getThemeColors('other'),
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
