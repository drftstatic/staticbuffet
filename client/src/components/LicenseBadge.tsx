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
    if (!license)
        return null;
    const getThemeColors = (baseType: string) => {
        {
            return baseType === 'pd'
                ? 'bg-lime-900/40 text-lime-300 border-lime-500 hover:bg-lime-900/60'
                : baseType === 'cc0'
                    ? 'bg-cyan-900/40 text-cyan-300 border-cyan-500 hover:bg-cyan-900/60'
                    : baseType === 'ccby'
                        ? 'bg-purple-900/40 text-purple-300 border-purple-500 hover:bg-purple-900/60'
                        : 'bg-yellow-900/40 text-yellow-300 border-yellow-500 hover:bg-yellow-900/60';
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
    const badge = (<span className={`px-2 py-1 text-xs rounded border font-medium cursor-pointer hover:opacity-80 transition-opacity ${licenseInfo.color} ${className}`} data-testid={`badge-license-${licenseInfo.label.toLowerCase().replace(/\s/g, '-')}`}>
      {licenseInfo.label}
    </span>);
    if (!showTooltip) {
        return badge;
    }
    return (<TooltipProvider>
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
              <ExternalLink size={10}/>
              <a href={licenseInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline" onClick={(e) => e.stopPropagation()}>
                View License
              </a>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>);
}
