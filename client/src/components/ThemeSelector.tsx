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
import { Palette } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
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
  { id: 'blondie', name: 'Blondie ETC.', color: 'bg-amber-600' }
] as const;

export function ThemeSelector() {
  const { brandSkin, setBrandSkin, adaptiveColorsEnabled, setAdaptiveColorsEnabled } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === brandSkin) || themes[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="p-2 text-white/70 hover:text-white backdrop-blur-sm"
          data-testid="button-theme-selector"
          title={`Current Theme: ${currentTheme.name}`}
        >
          <div className={`w-3 h-3 rounded-full ${currentTheme.color} mr-1`} />
          <Palette size={14} />
        </Button>
      </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-64 bg-black/40 backdrop-blur-xl border-white/20 text-white"
        >
          {/* Adaptive Colors Toggle */}
          <div className="flex items-center justify-between px-2 py-3">
            <DropdownMenuLabel className="text-white/80 m-0">Adaptive Colors</DropdownMenuLabel>
            <Switch
              checked={adaptiveColorsEnabled}
              onCheckedChange={setAdaptiveColorsEnabled}
              data-testid="switch-adaptive-colors"
            />
          </div>
          
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuLabel className="text-white/80">Visual Themes</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/20" />
          
          {themes.map((theme) => {
            const isActive = brandSkin === theme.id;
            
            return (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => setBrandSkin(theme.id)}
                className="cursor-pointer hover:bg-white/30 focus:bg-white/30 text-white"
                data-testid={`menu-theme-${theme.id}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${theme.color} mr-3`} />
                    <span className={isActive ? 'font-semibold' : ''}>{theme.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isActive && (
                      <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/30">
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
            Choose a visual theme to customize the interface
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}