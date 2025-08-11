import { useState } from 'react';
import { Save, FolderOpen, Trash2, Edit3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export function WorkspaceLayoutSaver() {
  const { brandSkin, savedWorkspaceLayouts, saveWorkspaceLayout, loadWorkspaceLayout, deleteWorkspaceLayout, updateWorkspaceLayout } = useStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState<string | null>(null);
  const [layoutName, setLayoutName] = useState('');
  const [layoutDescription, setLayoutDescription] = useState('');

  const handleSaveLayout = () => {
    if (!layoutName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your workspace layout.",
        variant: "destructive",
      });
      return;
    }

    if (editingLayout) {
      updateWorkspaceLayout(editingLayout, {
        name: layoutName,
        description: layoutDescription,
      });
      toast({
        title: "Layout updated",
        description: `"${layoutName}" has been updated.`,
      });
    } else {
      saveWorkspaceLayout(layoutName, layoutDescription);
      toast({
        title: "Layout saved",
        description: `"${layoutName}" workspace layout has been saved.`,
      });
    }

    setIsOpen(false);
    setEditingLayout(null);
    setLayoutName('');
    setLayoutDescription('');
  };

  const handleLoadLayout = (layoutId: string) => {
    const layout = savedWorkspaceLayouts.find(l => l.id === layoutId);
    if (layout) {
      loadWorkspaceLayout(layoutId);
      toast({
        title: "Layout loaded",
        description: `"${layout.name}" workspace layout has been applied.`,
      });
    }
  };

  const handleDeleteLayout = (layoutId: string) => {
    const layout = savedWorkspaceLayouts.find(l => l.id === layoutId);
    if (layout) {
      deleteWorkspaceLayout(layoutId);
      toast({
        title: "Layout deleted",
        description: `"${layout.name}" has been removed.`,
      });
    }
  };

  const handleEditLayout = (layoutId: string) => {
    const layout = savedWorkspaceLayouts.find(l => l.id === layoutId);
    if (layout) {
      setEditingLayout(layoutId);
      setLayoutName(layout.name);
      setLayoutDescription(layout.description || '');
      setIsOpen(true);
    }
  };

  const openNewLayoutDialog = () => {
    setEditingLayout(null);
    setLayoutName('');
    setLayoutDescription('');
    setIsOpen(true);
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Save Current Layout Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${
              brandSkin === 'waffle' 
                ? 'text-amber-800 hover:bg-yellow-100/50' 
                : brandSkin === 'ebn'
                ? 'text-yellow-300 hover:bg-purple-900/50'
                : brandSkin === 'ozzy'
                ? 'text-red-300 hover:bg-red-900/30'
                : 'text-yellow-300 hover:bg-gray-800/50'
            }`}
            onClick={openNewLayoutDialog}
            data-testid="button-save-layout"
          >
            <Save size={16} />
          </Button>
        </DialogTrigger>
        
        <DialogContent className={`sm:max-w-md ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50 border-yellow-400' 
            : brandSkin === 'ebn'
            ? 'bg-purple-950 border-yellow-400'
            : brandSkin === 'ozzy'
            ? 'bg-black border-red-500'
            : 'bg-gray-900 border-yellow-400'
        }`}>
          <DialogHeader>
            <DialogTitle className={
            brandSkin === 'waffle' ? 'text-amber-900' : 
            brandSkin === 'ebn' ? 'text-yellow-300' :
            brandSkin === 'ozzy' ? 'text-red-300' :
            'text-yellow-300'
          }>
              {editingLayout ? 'Edit Workspace Layout' : 'Save Workspace Layout'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                brandSkin === 'waffle' ? 'text-amber-800' : 'text-yellow-200'
              }`}>
                Layout Name *
              </label>
              <Input
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                placeholder="e.g., VJ Performance, Studio Setup, Broadcast Mode"
                className={`${
                  brandSkin === 'waffle'
                    ? 'bg-white border-yellow-300 text-amber-900'
                    : 'bg-purple-900 border-yellow-500 text-yellow-100'
                }`}
                data-testid="input-layout-name"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                brandSkin === 'waffle' ? 'text-amber-800' : 'text-yellow-200'
              }`}>
                Description (Optional)
              </label>
              <Textarea
                value={layoutDescription}
                onChange={(e) => setLayoutDescription(e.target.value)}
                placeholder="Describe when to use this layout..."
                rows={3}
                className={`${
                  brandSkin === 'waffle'
                    ? 'bg-white border-yellow-300 text-amber-900'
                    : 'bg-purple-900 border-yellow-500 text-yellow-100'
                }`}
                data-testid="textarea-layout-description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className={brandSkin === 'waffle' ? 'text-amber-800' : 'text-yellow-300'}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLayout}
              className={`${
                brandSkin === 'waffle'
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-amber-900'
                  : 'bg-yellow-400 hover:bg-yellow-500 text-purple-900'
              }`}
              data-testid="button-confirm-save"
            >
              {editingLayout ? 'Update' : 'Save'} Layout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Saved Layouts Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${
              brandSkin === 'waffle' 
                ? 'text-amber-800 hover:bg-yellow-100/50' 
                : 'text-yellow-300 hover:bg-purple-900/50'
            }`}
            disabled={savedWorkspaceLayouts.length === 0}
            data-testid="button-load-layouts"
          >
            <FolderOpen size={16} />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className={`min-w-[300px] ${
            brandSkin === 'waffle' 
              ? 'bg-yellow-50 border-yellow-400' 
              : 'bg-purple-950 border-yellow-400'
          }`}
        >
          <DropdownMenuLabel className={brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'}>
            Saved Workspace Layouts
          </DropdownMenuLabel>
          <DropdownMenuSeparator className={brandSkin === 'waffle' ? 'bg-yellow-300' : 'bg-yellow-500'} />
          
          {savedWorkspaceLayouts.length === 0 ? (
            <div className={`px-2 py-3 text-sm ${brandSkin === 'waffle' ? 'text-amber-600' : 'text-yellow-400'}`}>
              No saved layouts yet
            </div>
          ) : (
            savedWorkspaceLayouts.map((layout) => (
              <div key={layout.id} className="flex items-center justify-between px-2 py-1">
                <div 
                  className={`flex-1 cursor-pointer hover:bg-opacity-20 rounded p-1 ${
                    brandSkin === 'waffle' ? 'hover:bg-yellow-400' : 'hover:bg-yellow-500'
                  }`}
                  onClick={() => handleLoadLayout(layout.id)}
                  data-testid={`layout-${layout.id}`}
                >
                  <div className={`font-medium text-sm ${brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'}`}>
                    {layout.name}
                  </div>
                  {layout.description && (
                    <div className={`text-xs ${brandSkin === 'waffle' ? 'text-amber-700' : 'text-yellow-400'}`}>
                      {layout.description}
                    </div>
                  )}
                  <div className={`text-xs ${brandSkin === 'waffle' ? 'text-amber-600' : 'text-yellow-500'}`}>
                    {new Date(layout.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-auto ${
                      brandSkin === 'waffle' 
                        ? 'text-amber-700 hover:bg-yellow-200' 
                        : 'text-yellow-400 hover:bg-purple-800'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditLayout(layout.id);
                    }}
                    data-testid={`button-edit-${layout.id}`}
                  >
                    <Edit3 size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-auto ${
                      brandSkin === 'waffle' 
                        ? 'text-red-600 hover:bg-red-100' 
                        : 'text-red-400 hover:bg-red-900/30'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLayout(layout.id);
                    }}
                    data-testid={`button-delete-${layout.id}`}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}