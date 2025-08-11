import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export function BrandSkinToggle() {
  const { brandSkin, setBrandSkin } = useStore();

  const toggleSkin = () => {
    setBrandSkin(brandSkin === 'diner' ? 'ebn' : 'diner');
  };

  return (
    <Button
      onClick={toggleSkin}
      data-testid="button-theme-toggle"
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        brandSkin === 'diner'
          ? 'bg-amber-800 text-white hover:bg-amber-900'
          : 'bg-cyan-500 text-black hover:bg-cyan-400'
      }`}
    >
      {brandSkin === 'diner' ? 'EBN Mode' : 'Diner Mode'}
    </Button>
  );
}
