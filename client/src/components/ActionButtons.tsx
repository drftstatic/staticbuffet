import React from 'react';
import { EmergencyMix } from '@/components/EmergencyMix';
import { LuckyDip } from '@/components/LuckyDip';
import { useStore } from '@/lib/store';

interface ActionButtonsProps {
  onLuckyDipResults?: (results: any) => void;
}

export function ActionButtons({ onLuckyDipResults }: ActionButtonsProps) {
  const { brandSkin } = useStore();

  const handleLuckyDipResults = (results: any) => {
    onLuckyDipResults?.(results);
  };

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return 'bg-slate-800/40 border-slate-400/30';
      case 'waffle':
        return 'bg-amber-900/40 border-yellow-400/30';
      case 'ebn':
        return 'bg-gray-900/60 border-lime-500/30';
      case 'ozzy':
        return 'bg-red-900/40 border-red-500/30';
      case 'hogan':
        return 'bg-yellow-900/40 border-yellow-400/30';
      case 'dx':
        return 'bg-pink-900/40 border-pink-500/30';
      case 'maxheadroom':
        return 'bg-gray-900/60 border-green-500/30';
      case 'mario':
        return 'bg-red-900/40 border-yellow-400/30';
      case 'dakota':
        return 'bg-gray-800/40 border-gray-400/30';
      case 'blondie':
        return 'bg-amber-900/40 border-amber-400/30';
      default:
        return 'bg-slate-800/40 border-slate-400/30';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm ${getThemeClasses()}`}>
      <div className="flex items-center gap-1 text-xs font-medium text-white/80">
        <span>⚡</span>
        <span className="hidden sm:inline">Action Zone</span>
      </div>
      <div className="w-px h-4 bg-white/20" />
      <div className="flex items-center gap-1">
        <LuckyDip onDipResults={handleLuckyDipResults} />
        <EmergencyMix />
      </div>
    </div>
  );
}