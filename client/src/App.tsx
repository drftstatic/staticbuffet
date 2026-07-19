import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DragDropProvider } from "@/components/DragDropProvider";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { CommandPalette } from "@/components/CommandPalette";
import { useCommandPalette } from "@/hooks/use-command-palette";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isOpen: isCommandPaletteOpen, close: closeCommandPalette } = useCommandPalette();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DragDropProvider>
          <Toaster />
          <Router />
          <KeyboardShortcuts />
          <CommandPalette isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} />
        </DragDropProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
