import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Palette, Volume2 } from 'lucide-react';
import { useStore } from '@/lib/store';

const themes = [
  { id: 'testcard', name: 'Test Card', color: 'bg-blue-500' },
  { id: 'waffle', name: 'Waffle House', color: 'bg-yellow-500' },
  { id: 'ebn', name: 'EBN Hijack', color: 'bg-lime-500' },
  { id: 'ozzy', name: 'Heavy Metal', color: 'bg-red-600' },
  { id: 'hogan', name: 'NWO Hollywood', color: 'bg-yellow-600' },
  { id: 'dx', name: 'D-Generation X', color: 'bg-pink-500' },
  { id: 'maxheadroom', name: 'Max Headroom', color: 'bg-green-500' },
  { id: 'mario', name: 'Mario Plumber', color: 'bg-red-500' },
  { id: 'dakota', name: 'Dodge Dakota', color: 'bg-gray-600' },
  { id: 'blondie', name: 'Blondie', color: 'bg-amber-600' }
] as const;

export function ThemeSelector() {
  const { brandSkin, setBrandSkin } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === brandSkin) || themes[0];
  const hasAudio = ['waffle', 'ozzy', 'mario', 'maxheadroom'].includes(brandSkin);

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-black/80 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            data-testid="button-theme-selector"
          >
            <div className={`w-3 h-3 rounded-full ${currentTheme.color} mr-2`} />
            <Palette size={16} className="mr-1" />
            {currentTheme.name}
            {hasAudio && <Volume2 size={12} className="ml-1 opacity-60" />}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-black/90 border-white/20 text-white"
        >
          <DropdownMenuLabel className="text-white/80">Visual Themes</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/20" />
          
          {themes.map((theme) => {
            const isActive = brandSkin === theme.id;
            const themeHasAudio = ['waffle', 'ozzy', 'mario', 'maxheadroom'].includes(theme.id);
            
            return (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => setBrandSkin(theme.id)}
                className="cursor-pointer hover:bg-white/20 focus:bg-white/20 text-white"
                data-testid={`menu-theme-${theme.id}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${theme.color} mr-3`} />
                    <span className={isActive ? 'font-semibold' : ''}>{theme.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {themeHasAudio && (
                      <Volume2 size={12} className="opacity-60" title="Has soundboard" />
                    )}
                    {isActive && (
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/40">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
          
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuLabel className="text-xs text-white/60">
            Themes with <Volume2 size={10} className="inline mx-1" /> have soundboards (triple-click)
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}