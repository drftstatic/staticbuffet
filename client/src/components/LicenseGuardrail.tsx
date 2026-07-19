import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Shield, ShieldOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface LicenseGuardrailProps {
  onLicenseChange: () => void;
}

export function LicenseGuardrail({ onLicenseChange }: LicenseGuardrailProps) {
  const { searchState, setSearchState, brandSkin } = useStore();
  const { toast } = useToast();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return {
          text: 'text-blue-400',
          warning: 'text-blue-300',
          bg: 'bg-blue-400/10',
          border: 'border-blue-400/30'
        };
      case 'waffle':
        return {
          text: 'text-amber-800',
          warning: 'text-amber-700',
          bg: 'bg-yellow-100/50',
          border: 'border-yellow-400/30'
        };
      case 'ebn':
        return {
          text: 'text-lime-400',
          warning: 'text-lime-300',
          bg: 'bg-lime-900/50',
          border: 'border-lime-500/30'
        };
      case 'ozzy':
        return {
          text: 'text-red-300',
          warning: 'text-red-200',
          bg: 'bg-red-900/30',
          border: 'border-red-500/30'
        };
      case 'hogan':
        return {
          text: 'text-yellow-300',
          warning: 'text-yellow-200',
          bg: 'bg-yellow-900/50',
          border: 'border-yellow-400/30'
        };
      case 'dx':
        return {
          text: 'text-pink-300',
          warning: 'text-pink-200',
          bg: 'bg-pink-900/50',
          border: 'border-pink-500/30'
        };
      case 'maxheadroom':
        return {
          text: 'text-green-300',
          warning: 'text-green-200',
          bg: 'bg-green-900/50',
          border: 'border-green-500/30'
        };
      case 'mario':
        return {
          text: 'text-yellow-300',
          warning: 'text-yellow-200',
          bg: 'bg-red-900/50',
          border: 'border-yellow-400/30'
        };
      case 'dakota':
        return {
          text: 'text-gray-300',
          warning: 'text-gray-200',
          bg: 'bg-gray-800/50',
          border: 'border-gray-400/30'
        };
      case 'blondie':
        return {
          text: 'text-amber-300',
          warning: 'text-amber-200',
          bg: 'bg-amber-900/50',
          border: 'border-amber-400/30'
        };
      default:
        return {
          text: 'text-blue-400',
          warning: 'text-blue-300',
          bg: 'bg-blue-400/10',
          border: 'border-blue-400/30'
        };
    }
  };

  const theme = getThemeClasses();

  const handleToggleRestricted = (enabled: boolean) => {
    if (enabled) {
      setShowDisclaimer(true);
    } else {
      setSearchState({ 
        allowRestrictedLicenses: false, 
        license: searchState.license === 'restricted' ? 'all' : searchState.license,
        page: 1 
      });
      onLicenseChange();
      
      toast({
        title: "License Guardrail Enabled",
        description: "Only Public Domain, CC0, and CC-BY content will be shown.",
      });
    }
  };

  const confirmRestrictedAccess = () => {
    setSearchState({ allowRestrictedLicenses: true, page: 1 });
    setShowDisclaimer(false);
    onLicenseChange();
    
    toast({
      title: "Restricted Licenses Enabled",
      description: "CC-NC and CC-ND content is now included. Check licenses before use.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {searchState.allowRestrictedLicenses ? (
          <span title="License Guardrail Off - Restricted licenses allowed"><ShieldOff size={16} className="text-orange-400" /></span>
        ) : (
          <span title="License Guardrail On - Safe licenses only"><Shield size={16} className={theme.text} /></span>
        )}
        <Switch
          id="license-guardrail"
          checked={!searchState.allowRestrictedLicenses}
          onCheckedChange={(checked) => handleToggleRestricted(!checked)}
          data-testid="switch-license-guardrail"
        />
      </div>

      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className={`sm:max-w-md ${theme.bg} ${theme.border} border`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center space-x-2 ${theme.text}`}>
              <AlertTriangle size={20} className="text-orange-400" />
              <span>License Warning</span>
            </DialogTitle>
            <DialogDescription className={theme.warning}>
              You're about to enable access to CC-NC (Non-Commercial) and CC-ND (No Derivatives) content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className={`p-3 rounded-lg ${theme.bg} ${theme.border} border-2 border-dashed`}>
              <div className={`text-sm ${theme.warning} space-y-2`}>
                <div className="font-medium">⚠️ Important Licensing Restrictions:</div>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• <strong>CC-NC:</strong> No commercial use allowed</li>
                  <li>• <strong>CC-ND:</strong> No modifications/remixes allowed</li>
                  <li>• <strong>CC-SA:</strong> Must share derivative works under same license</li>
                  <li>• Always check individual file licenses before use</li>
                </ul>
              </div>
            </div>
            
            <div className="text-xs text-gray-400">
              Public Domain, CC0, and CC-BY content remains the safest choice for VJ work and remixing.
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDisclaimer(false)}
                className={theme.border}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmRestrictedAccess}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                I Understand - Enable
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 ${theme.text} hover:${theme.bg}`}
            data-testid="button-license-info"
          >
            <Info size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className={`sm:max-w-lg ${theme.bg} ${theme.border} border`}>
          <DialogHeader>
            <DialogTitle className={theme.text}>License Guide</DialogTitle>
            <DialogDescription className={theme.warning}>
              Understanding Creative Commons and Public Domain licenses
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${theme.bg} ${theme.border} border`}>
                <div className={`font-medium text-sm ${theme.text} mb-2`}>✅ Safe for VJ Use:</div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div><strong>Public Domain:</strong> No restrictions, completely free to use</div>
                  <div><strong>CC0:</strong> Public domain dedication, no rights reserved</div>
                  <div><strong>CC-BY:</strong> Free to use with attribution</div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg bg-orange-900/30 border-orange-500/30 border`}>
                <div className="font-medium text-sm text-orange-300 mb-2">⚠️ Restricted Use:</div>
                <div className="text-xs text-orange-200 space-y-1">
                  <div><strong>CC-NC:</strong> Non-commercial only (no paid gigs!)</div>
                  <div><strong>CC-ND:</strong> No derivatives (no mixing/editing)</div>
                  <div><strong>CC-SA:</strong> Share-alike (derivatives must use same license)</div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-400">
              Static Buffet defaults to legally safe options. When in doubt, stick with Public Domain and CC0 content.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}