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
        {
            return 'bg-gray-900/60 border-lime-500/30';
        }
    };
    return (<div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm ${getThemeClasses()}`}>
      <div className="flex items-center gap-1 text-xs font-medium text-white/80">
        <span>⚡</span>
        <span className="hidden sm:inline">Action Zone</span>
      </div>
      <div className="w-px h-4 bg-white/20"/>
      <div className="flex items-center gap-1">
        <LuckyDip onDipResults={handleLuckyDipResults}/>
        <EmergencyMix />
      </div>
    </div>);
}
