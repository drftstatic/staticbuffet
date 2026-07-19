import { ChevronDown, ChevronUp, Minimize2, Maximize2 } from 'lucide-react';
import { useStore } from '@/lib/store';
interface PanelHeaderProps {
    title: string;
    status?: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    children?: React.ReactNode;
}
export function PanelHeader({ title, status, isCollapsed, onToggleCollapse, children }: PanelHeaderProps) {
    const { brandSkin } = useStore();
    return (<div className={`flex items-center justify-between p-3 border-b-2 ${'bg-purple-900/60 border-yellow-400/30'}`}>
      <div className="flex items-center space-x-3">
        <h3 className={`font-bold text-sm uppercase tracking-wide font-mono ${'text-yellow-300'}`}>
          {title}
        </h3>
        {status && (<span className={`text-xs px-2 py-0.5 rounded font-mono ${'bg-yellow-400/20 text-yellow-200'}`}>
            {status}
          </span>)}
      </div>
      
      <div className="flex items-center space-x-2">
        {children}
        <button onClick={onToggleCollapse} className={`p-1 rounded hover:bg-black/10 transition-colors ${'text-yellow-300'}`} data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {isCollapsed ? (<Maximize2 size={16}/>) : (<Minimize2 size={16}/>)}
        </button>
      </div>
    </div>);
}
