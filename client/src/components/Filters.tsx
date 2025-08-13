import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import { Calendar, Shield, Globe, Scale, Lock, Clock, Zap, Timer, Hourglass } from 'lucide-react';
import { SourceToggles } from '@/components/SourceToggles';
import { LicenseGuardrail } from '@/components/LicenseGuardrail';

interface FiltersProps {
  onFiltersChange: () => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const { searchState, setSearchState } = useStore();

  const handleFilterChange = (key: string, value: string) => {
    setSearchState({ [key]: value, page: 1 });
    onFiltersChange();
  };

  const getLicenseIcon = (value: string) => {
    switch (value) {
      case 'all':
        return <Globe className="h-3 w-3 text-green-400" />;
      case 'publicdomain':
        return <Scale className="h-3 w-3 text-blue-400" />;
      case 'cc0':
        return <Shield className="h-3 w-3 text-cyan-400" />;
      case 'ccby':
        return <Shield className="h-3 w-3 text-yellow-400" />;
      case 'restricted':
        return <Lock className="h-3 w-3 text-red-400" />;
      default:
        return <Globe className="h-3 w-3 text-green-400" />;
    }
  };


  const handleDurationChange = (duration: string) => {
    handleFilterChange('duration', duration);
  };

  return (
    <div className="flex items-center space-x-3 text-xs">
      <div className="flex items-center space-x-1">
        <Calendar className="h-3 w-3 text-gray-300" title="Year Range" />
        <Select 
          value={searchState.yearFrom || '1950'} 
          onValueChange={(value) => handleFilterChange('yearFrom', value)}
        >
          <SelectTrigger 
            className="w-16 h-7 px-1.5 py-0.5 text-xs rounded border-white/20 bg-black/30 text-white hover:bg-black/50 transition-colors"
            data-testid="select-year-from"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1900">1900</SelectItem>
            <SelectItem value="1920">1920</SelectItem>
            <SelectItem value="1940">1940</SelectItem>
            <SelectItem value="1950">1950</SelectItem>
            <SelectItem value="1960">1960</SelectItem>
            <SelectItem value="1970">1970</SelectItem>
            <SelectItem value="1980">1980</SelectItem>
            <SelectItem value="1990">1990</SelectItem>
            <SelectItem value="2000">2000</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-gray-400 text-xs">to</span>
        <Select 
          value={searchState.yearTo || '2025'} 
          onValueChange={(value) => handleFilterChange('yearTo', value)}
        >
          <SelectTrigger 
            className="w-16 h-7 px-1.5 py-0.5 text-xs rounded border-white/20 bg-black/30 text-white hover:bg-black/50 transition-colors"
            data-testid="select-year-to"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2000">2000</SelectItem>
            <SelectItem value="2010">2010</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>
      

      <div className="flex items-center space-x-1">
        <Shield className="h-3 w-3 text-gray-300" title="License" />
        <Select 
          value={searchState.license || 'all'} 
          onValueChange={(value) => handleFilterChange('license', value)}
        >
          <SelectTrigger 
            className="w-8 h-7 px-1.5 py-0.5 text-xs rounded border-white/20 bg-black/30 text-white hover:bg-black/50 transition-colors flex items-center justify-center"
            data-testid="select-license"
          >
            {getLicenseIcon(searchState.license || 'all')}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center space-x-2">
                <Globe className="h-3 w-3 text-green-400" />
                <span>All Open</span>
              </div>
            </SelectItem>
            <SelectItem value="publicdomain">
              <div className="flex items-center space-x-2">
                <Scale className="h-3 w-3 text-blue-400" />
                <span>Public Domain</span>
              </div>
            </SelectItem>
            <SelectItem value="cc0">
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3 text-cyan-400" />
                <span>CC0</span>
              </div>
            </SelectItem>
            <SelectItem value="ccby">
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3 text-yellow-400" />
                <span>CC-BY</span>
              </div>
            </SelectItem>
            <SelectItem value="restricted">
              <div className="flex items-center space-x-2">
                <Lock className="h-3 w-3 text-red-400" />
                <span>Restricted</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Duration Controls */}
      <div className="flex gap-1">
        <button
          onClick={() => handleDurationChange('any')}
          className={`h-7 px-2 text-xs rounded border transition-colors flex items-center ${
            searchState.duration === 'any' || !searchState.duration 
              ? 'border-white/40 bg-white/20 text-white' 
              : 'border-white/20 bg-black/30 text-gray-300 hover:bg-black/50'
          }`}
          title="Any duration"
        >
          <Clock className="h-3 w-3" />
        </button>
        <button
          onClick={() => handleDurationChange('short')}
          className={`h-7 px-2 text-xs rounded border transition-colors flex items-center ${
            searchState.duration === 'short' 
              ? 'border-yellow-400/40 bg-yellow-400/20 text-yellow-300' 
              : 'border-white/20 bg-black/30 text-gray-300 hover:bg-black/50'
          }`}
          title="Under 5 minutes"
        >
          <Zap className="h-3 w-3" />
        </button>
        <button
          onClick={() => handleDurationChange('medium')}
          className={`h-7 px-2 text-xs rounded border transition-colors flex items-center ${
            searchState.duration === 'medium' 
              ? 'border-blue-400/40 bg-blue-400/20 text-blue-300' 
              : 'border-white/20 bg-black/30 text-gray-300 hover:bg-black/50'
          }`}
          title="5-30 minutes"
        >
          <Timer className="h-3 w-3" />
        </button>
        <button
          onClick={() => handleDurationChange('long')}
          className={`h-7 px-2 text-xs rounded border transition-colors flex items-center ${
            searchState.duration === 'long' 
              ? 'border-purple-400/40 bg-purple-400/20 text-purple-300' 
              : 'border-white/20 bg-black/30 text-gray-300 hover:bg-black/50'
          }`}
          title="Over 30 minutes"
        >
          <Hourglass className="h-3 w-3" />
        </button>
      </div>

      {/* Source Toggles */}
      <SourceToggles onSourcesChange={onFiltersChange} />
      
      {/* License Guardrail */}
      <LicenseGuardrail onLicenseChange={onFiltersChange} />

    </div>
  );
}
