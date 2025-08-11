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
          : 'border-lime-500/30 bg-gray-800/50'
      }`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="waffle">🧇 Waffle House Mode</SelectItem>
        <SelectItem value="ebn">📺 EBN Hijack Mode</SelectItem>
      </SelectContent>
    </Select>
  );
}