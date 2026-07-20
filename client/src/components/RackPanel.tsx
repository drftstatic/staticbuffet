import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { RACK_EFFECTS } from '@/engine/effects';
import { useStore } from '@/lib/store';

// The effect rack UI is generated from the engine registry: one named
// intensity slider per effect, nothing else. Adding an effect to
// engine/effects.ts adds it here automatically.
export function RackPanel() {
  const { rackEffects, setRackEffect, resetRackEffects } = useStore();
  const anyActive = Object.values(rackEffects).some((v) => v > 0);

  return (
    <div className="space-y-3 p-3" data-testid="rack-panel">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">One knob per effect · beat-synced</span>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 px-2 ${anyActive ? 'text-lime-300' : 'text-gray-600'}`}
          onClick={resetRackEffects}
          title="Reset all rack effects"
          data-testid="button-rack-reset"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
      {RACK_EFFECTS.map((fx) => {
        const value = rackEffects[fx.id] ?? 0;
        return (
          <div key={fx.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">{fx.name}</Label>
              <span className={`text-xs px-2 py-0.5 rounded ${value > 0 ? 'text-lime-300 bg-lime-900/30' : 'text-gray-500 bg-gray-800/50'}`}>
                {value}%
              </span>
            </div>
            <Slider
              value={[value]}
              onValueChange={([v]) => setRackEffect(fx.id, v)}
              min={0}
              max={100}
              step={1}
              data-testid={`slider-rack-${fx.id}`}
            />
          </div>
        );
      })}
    </div>
  );
}
