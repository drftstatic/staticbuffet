import { useStore } from '@/lib/store';

export function MarioPipeEffect() {
  const { brandSkin, isMarioMode } = useStore();

  // Only show when Mario theme is active and SEXY mode is enabled
  if (brandSkin !== 'mario' || !isMarioMode) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] mario-pipe-effect">
      {/* Floating Mario Elements */}
      <div className="absolute top-1/4 left-1/4 text-2xl animate-bounce opacity-20">
        🍄
      </div>
      <div className="absolute top-3/4 right-1/4 text-lg animate-pulse opacity-15">
        ⭐
      </div>
      <div className="absolute top-1/2 left-1/3 text-xl opacity-10 animate-spin" style={{animationDuration: '8s'}}>
        🌶️
      </div>
      
      {/* Sexy Mario Watermark */}
      <div className="absolute bottom-4 right-4 text-xs text-yellow-200/20 font-mono rotate-12">
        SEXY MARIO MODE ACTIVE
      </div>
    </div>
  );
}