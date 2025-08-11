import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { type BrandSkin } from '@/lib/types';

export function ThemeSwitcher() {
  const { brandSkin, setBrandSkin } = useStore();

  const handleThemeChange = (value: BrandSkin) => {
    setBrandSkin(value);
  };

  return (
    <Select value={brandSkin} onValueChange={handleThemeChange}>
      <SelectTrigger className={`w-56 ${
        brandSkin === 'waffle' 
          ? 'border-yellow-400/50 bg-yellow-50/50' 
          : brandSkin === 'ebn'
          ? 'border-lime-500/30 bg-gray-800/50'
          : brandSkin === 'ozzy'
          ? 'border-red-500/50 bg-black/80 text-red-200'
          : brandSkin === 'mario'
          ? 'border-red-500/50 bg-red-900/50 text-yellow-200'
          : 'border-yellow-400/50 bg-gray-800/80 text-yellow-200'
      }`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="waffle">🧇 Waffle House</SelectItem>
        <SelectItem value="ebn">📺 EBN Hijack</SelectItem>
        <SelectItem value="ozzy">🦇 Heavy Metal</SelectItem>
        <SelectItem value="hogan">💪 NWO Hollywood</SelectItem>
        <SelectItem value="dx">🤘 D-Generation X</SelectItem>
        <SelectItem value="maxheadroom">📺 Max Headroom</SelectItem>
        <SelectItem value="mario">🍄 Mario Plumber</SelectItem>
      </SelectContent>
    </Select>
  );
}