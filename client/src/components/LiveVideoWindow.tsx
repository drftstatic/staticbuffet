import React from 'react';
import { FloatingPanel } from '@/components/FloatingPanel';
import { LiveVideoMode } from '@/components/LiveVideoMode';
import { useStore } from '@/lib/store';

export function LiveVideoWindow() {
  const { brandSkin } = useStore();

  return (
    <FloatingPanel
      id="liveVideo"
      title="📹 Live Video Input"
      brandSkin={brandSkin}
    >
      <div className="p-2">
        <LiveVideoMode />
      </div>
    </FloatingPanel>
  );
}