import React from 'react';
import { EDLRecorder } from '@/components/EDLRecorder';
import { FileText } from 'lucide-react';

export function RecordSetPanel() {
  return (
    <div className="space-y-2 p-2">
      <div className="flex items-center space-x-2">
        <FileText className="h-3 w-3" />
        <h3 className="font-medium text-xs">Record Set (EDL)</h3>
      </div>
      <EDLRecorder />
    </div>
  );
}