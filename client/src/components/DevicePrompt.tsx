import { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
export function DevicePrompt() {
    const { brandSkin } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        // Check if user is on mobile/small screen
        const checkDevice = () => {
            const isMobileDevice = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(isMobileDevice);
            // Check if user has seen this prompt before
            const hasSeenPrompt = localStorage.getItem('staticBuffet-devicePromptSeen');
            if (isMobileDevice && !hasSeenPrompt) {
                setIsOpen(true);
            }
        };
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);
    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('staticBuffet-devicePromptSeen', 'true');
    };
    const handleContinueAnyway = () => {
        setIsOpen(false);
        localStorage.setItem('staticBuffet-devicePromptSeen', 'true');
    };
    if (!isOpen)
        return null;
    return (<Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={`max-w-md ${'bg-purple-950 border-yellow-400'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center space-x-2 ${'text-yellow-300'}`}>
            <Monitor size={20}/>
            <span>Optimal Viewing Experience</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className={`space-y-4 ${'text-yellow-200'}`}>
          <p className="text-sm">
            <strong>Static Buffet</strong> is designed for professional VJ mixing and works best on:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Monitor size={16} className="text-green-500"/>
              <span className="text-sm">Laptop or Desktop (Recommended)</span>
            </div>
            <div className="flex items-center space-x-3">
              <Tablet size={16} className="text-yellow-500"/>
              <span className="text-sm">Tablet in Landscape Mode</span>
            </div>
            <div className="flex items-center space-x-3 opacity-50">
              <Smartphone size={16} className="text-red-500"/>
              <span className="text-sm">Mobile Version Coming Soon</span>
            </div>
          </div>
          
          <p className="text-xs opacity-75">
            For the best VJ experience with full panel visibility and precise controls, 
            we recommend using a larger screen device.
          </p>
        </div>
        
        <div className="flex space-x-2 pt-4">
          <Button onClick={handleClose} className={`flex-1 ${'bg-yellow-400 hover:bg-yellow-300 text-black'}`}>
            Got It
          </Button>
          <Button variant="outline" onClick={handleContinueAnyway} className={`${'border-yellow-400 text-yellow-300 hover:bg-purple-900'}`}>
            Continue Anyway
          </Button>
        </div>
      </DialogContent>
    </Dialog>);
}
