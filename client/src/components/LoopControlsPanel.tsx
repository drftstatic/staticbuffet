import React from 'react';
import { LoopControls } from '@/components/LoopControls';
import { RotateCw } from 'lucide-react';

export function LoopControlsPanel() {
  return (
    <div className="space-y-2 p-2">
      <div className="flex items-center space-x-2">
        <RotateCw className="h-3 w-3" />
        <h3 className="font-medium text-xs">Loop Controls</h3>
      </div>
      <LoopControls />
    </div>
  );
}