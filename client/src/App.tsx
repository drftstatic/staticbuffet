import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EasterEgg } from "@/components/EasterEgg";
import { useEasterEgg } from "@/hooks/use-easter-egg";
import { DragDropProvider } from "@/components/DragDropProvider";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import Home from "@/pages/home";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isEasterEggActive, closeEasterEgg } = useEasterEgg();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DragDropProvider>
          <Toaster />
          <Router />
          <EasterEgg isActive={isEasterEggActive} onClose={closeEasterEgg} />
          <KeyboardShortcuts />
        </DragDropProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
