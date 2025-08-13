import { useStore } from '@/lib/store';
import { Terminal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AsciiModeIndicator() {
  const { isAsciiMode, setAsciiMode } = useStore();

  if (!isAsciiMode) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex items-center space-x-2 bg-black border border-green-400 px-3 py-2 rounded font-mono text-green-400 text-sm">
      <Terminal size={16} />
      <span>ASCII TERMINAL MODE</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setAsciiMode(false)}
        className="h-6 w-6 p-0 hover:bg-green-400 hover:text-black"
        title="Exit ASCII Mode (or press Esc)"
      >
        <X size={12} />
      </Button>
    </div>
  );
}