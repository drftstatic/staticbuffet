import { useStore } from '@/lib/store';
import { Ticker } from './Ticker';

export function BottomHUD() {
  const { brandSkin, queueItems } = useStore();

  if (brandSkin !== 'ebn') {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-lime-500/20 z-40"
      data-testid="bottom-hud"
    >
      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="w-full h-full opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(132, 204, 22, 0.03) 2px,
              rgba(132, 204, 22, 0.03) 4px
            )`
          }}
        />
      </div>

      <Ticker />
    </div>
  );
}
