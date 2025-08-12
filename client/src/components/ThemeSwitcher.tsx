import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { type BrandSkin } from '@/lib/types';

export function ThemeSwitcher() {
  const { brandSkin, setBrandSkin } = useStore();

  const handleThemeChange = (value: BrandSkin) => {
    setBrandSkin(value);
  };

  return (
    <Select value={brandSkin || 'testcard'} onValueChange={handleThemeChange}>
      <SelectTrigger className={`w-56 ${
        brandSkin === 'testcard'
          ? 'border-blue-400/50 bg-gray-900/50 text-white'
          : brandSkin === 'waffle' 
          ? 'border-yellow-400/50 bg-yellow-50/50' 
          : brandSkin === 'ebn'
          ? 'border-lime-500/30 bg-gray-800/50'
          : brandSkin === 'ozzy'
          ? 'border-red-500/50 bg-black/80 text-red-200'
          : brandSkin === 'mario'
          ? 'border-red-500/50 bg-red-900/50 text-yellow-200'
          : brandSkin === 'dakota'
          ? 'border-gray-500/50 bg-black/80 text-gray-200'
          : brandSkin === 'blondie'
          ? 'border-amber-500/50 bg-amber-900/50 text-amber-200'
          : 'border-yellow-400/50 bg-gray-800/80 text-yellow-200'
      }`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="testcard">📺 Test Card</SelectItem>
        <SelectItem value="waffle">🧇 Waffle House</SelectItem>
        <SelectItem value="ebn">📺 EBN Hijack</SelectItem>
        <SelectItem value="ozzy">🦇 Heavy Metal</SelectItem>
        <SelectItem value="hogan">💪 NWO Hollywood</SelectItem>
        <SelectItem value="dx">🤘 D-Generation X</SelectItem>
        <SelectItem value="maxheadroom">📺 Max Headroom</SelectItem>
        <SelectItem value="mario">🍄 Mario Plumber</SelectItem>
        <SelectItem value="dakota">🚚 Dodge Dakota</SelectItem>
        <SelectItem value="blondie">🎵 Blondie</SelectItem>
      </SelectContent>
    </Select>
  );
}