interface LicenseBadgeProps {
  license?: string;
  className?: string;
}

export function LicenseBadge({ license, className = '' }: LicenseBadgeProps) {
  if (!license) return null;

  const getLicenseType = (licenseUrl: string): string => {
    const url = licenseUrl.toLowerCase();
    if (url.includes('publicdomain')) return 'PUBLIC DOMAIN';
    if (url.includes('cc0')) return 'CC0';
    if (url.includes('by')) return 'CC-BY';
    return 'OPEN';
  };

  const getLicenseColor = (licenseType: string): string => {
    switch (licenseType) {
      case 'PUBLIC DOMAIN':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'CC0':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'CC-BY':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  const licenseType = getLicenseType(license);
  const colorClasses = getLicenseColor(licenseType);

  return (
    <span 
      className={`px-2 py-1 text-xs rounded font-medium ${colorClasses} ${className}`}
      data-testid={`badge-license-${licenseType.toLowerCase().replace(/\s/g, '-')}`}
    >
      {licenseType}
    </span>
  );
}
