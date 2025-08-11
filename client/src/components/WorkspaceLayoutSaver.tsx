import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/lib/store';
import { Save, FolderOpen, Trash2, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WorkspaceLayoutSaver() {
  const { 
    savedWorkspaceLayouts, 
    saveWorkspaceLayout, 
    loadWorkspaceLayout, 
    deleteWorkspaceLayout,
    updateWorkspaceLayout,
    brandSkin 
  } = useStore();
  const { toast } = useToast();
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [layoutDescription, setLayoutDescription] = useState('');
  const [editingLayout, setEditingLayout] = useState<string | null>(null);

  const handleSaveLayout = () => {
    if (!layoutName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your workspace layout.",
        variant: "destructive",
      });
      return;
    }

    saveWorkspaceLayout(layoutName.trim(), layoutDescription.trim());
    setLayoutName('');
    setLayoutDescription('');
    setSaveDialogOpen(false);
    
    toast({
      title: "Layout Saved",
      description: `Workspace layout "${layoutName}" has been saved successfully.`,
    });
  };

  const handleLoadLayout = (layoutId: string) => {
    loadWorkspaceLayout(layoutId);
    const layout = savedWorkspaceLayouts.find(l => l.id === layoutId);
    toast({
      title: "Layout Loaded",
      description: `Workspace layout "${layout?.name}" has been applied.`,
    });
  };

  const handleDeleteLayout = (layoutId: string) => {
    const layout = savedWorkspaceLayouts.find(l => l.id === layoutId);
    deleteWorkspaceLayout(layoutId);
    toast({
      title: "Layout Deleted",
      description: `Workspace layout "${layout?.name}" has been deleted.`,
    });
  };

  const handleEditLayout = (layoutId: string) => {
    const layout = savedWorkspaceLayouts.find(l => l.id === layoutId);
    if (layout) {
      setEditingLayout(layoutId);
      setLayoutName(layout.name);
      setLayoutDescription(layout.description || '');
      setEditDialogOpen(true);
    }
  };

  const handleUpdateLayout = () => {
    if (!layoutName.trim() || !editingLayout) return;

    updateWorkspaceLayout(editingLayout, {
      name: layoutName.trim(),
      description: layoutDescription.trim(),
    });

    setEditingLayout(null);
    setLayoutName('');
    setLayoutDescription('');
    setEditDialogOpen(false);

    toast({
      title: "Layout Updated",
      description: `Workspace layout has been updated successfully.`,
    });
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Save Layout Button */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${
              brandSkin === 'waffle' ? 'text-amber-800 hover:bg-yellow-100/50' : 
              brandSkin === 'ebn' ? 'text-yellow-300 hover:bg-purple-900/50' :
              brandSkin === 'ozzy' ? 'text-red-300 hover:bg-red-900/30' :
              'text-yellow-300 hover:bg-gray-800/50'
            }`}
            title="Save current workspace layout"
            data-testid="button-save-layout"
          >
            <Save size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Workspace Layout</DialogTitle>
            <DialogDescription>
              Save your current panel configuration for later use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="layout-name">Layout Name</Label>
              <Input
                id="layout-name"
                placeholder="e.g., My Custom Layout"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="layout-description">Description (Optional)</Label>
              <Textarea
                id="layout-description"
                placeholder="Brief description of this layout's purpose"
                value={layoutDescription}
                onChange={(e) => setLayoutDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveLayout}>
                Save Layout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Layout Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${
              brandSkin === 'waffle' ? 'text-amber-800 hover:bg-yellow-100/50' : 
              brandSkin === 'ebn' ? 'text-yellow-300 hover:bg-purple-900/50' :
              brandSkin === 'ozzy' ? 'text-red-300 hover:bg-red-900/30' :
              'text-yellow-300 hover:bg-gray-800/50'
            }`}
            title="Load workspace layout"
            data-testid="button-load-layout"
          >
            <FolderOpen size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Workspace Layouts</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {savedWorkspaceLayouts.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              No saved layouts yet
            </div>
          ) : (
            savedWorkspaceLayouts.map((layout) => (
              <div key={layout.id} className="flex items-center justify-between px-2 py-1 hover:bg-accent rounded-sm">
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => handleLoadLayout(layout.id)}
                    className="w-full text-left"
                  >
                    <div className="font-medium text-sm truncate">{layout.name}</div>
                    {layout.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {layout.description}
                      </div>
                    )}
                  </button>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditLayout(layout.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit3 size={12} />
                  </Button>
                  {!layout.id.startsWith('default_') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLayout(layout.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Layout Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Workspace Layout</DialogTitle>
            <DialogDescription>
              Update the name and description of your layout.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-layout-name">Layout Name</Label>
              <Input
                id="edit-layout-name"
                placeholder="e.g., My Custom Layout"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-layout-description">Description (Optional)</Label>
              <Textarea
                id="edit-layout-description"
                placeholder="Brief description of this layout's purpose"
                value={layoutDescription}
                onChange={(e) => setLayoutDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateLayout}>
                Update Layout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}