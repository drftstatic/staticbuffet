import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";

const tips = {
  waffle: [
    "Your tip = more loops on the table.",
    "Help us keep the hash browns hot.",
    "Every dollar buys another weird clip.",
    "We work for tips and test patterns.",
    "Hot coffee refills included."
  ],
  ebn: [
    "Boost our broadcast range.",
    "Static travels farther with your help.",
    "Your contribution just hijacked another channel.",
    "Because dead air is boring.",
    "More chaos, less silence."
  ]
};

function rand(arr: string[]): string { 
  return arr[Math.floor(Math.random() * arr.length)]; 
}

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, options: Record<string, any>) => void;
    };
  }
}

export default function DonationCTA() {
  const { brandSkin } = useStore();
  const mode = brandSkin === 'waffle' ? 'waffle' : 'ebn';
  const [tip, setTip] = useState(rand(tips[mode] || tips.ebn));
  const [isLoaded, setIsLoaded] = useState(false);
  const label = mode === "waffle" ? "Feed the Buffet" : "Send a Signal";
  
  const btnBase = "px-4 py-2 rounded-2xl font-semibold transition transform active:scale-[0.98] focus:outline-none focus:ring";
  const btnWaffle = "bg-yellow-300 text-black hover:bg-yellow-200 ring-yellow-400";
  const btnEbn = "bg-black text-[#FFD300] border border-[#FFD300]/60 hover:bg-zinc-900 ring-yellow-400";

  useEffect(() => {
    // Load Ko-fi overlay script
    if (!document.querySelector('script[src*="overlay-widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
      script.onload = () => {
        setIsLoaded(true);
        // Initialize the overlay widget
        if (window.kofiWidgetOverlay) {
          window.kofiWidgetOverlay.draw('staticbuffet', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Tip Us',
            'floating-chat.donateButton.background-color': mode === 'waffle' ? '#F59E0B' : '#323842',
            'floating-chat.donateButton.text-color': mode === 'waffle' ? '#000' : '#fff'
          });
        }
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, [mode]);

  const showKoFiWidget = () => {
    if (window.kofiWidgetOverlay) {
      // The widget should already be initialized, clicking should activate it
      const kofiButton = document.querySelector('[data-kofi-button]') as HTMLElement;
      if (kofiButton) {
        kofiButton.click();
      }
    }
  };

  return (
    <div className="relative inline-block group">
      <button
        className={`${btnBase} ${mode === "waffle" ? btnWaffle : btnEbn}`}
        onMouseEnter={() => setTip(rand(tips[mode] || tips.ebn))}
        onClick={showKoFiWidget}
        aria-label={`${label} — opens Ko-fi donation widget`}
        data-testid="button-donate"
        disabled={!isLoaded}
      >
        {label}
      </button>

      {/* Tooltip */}
      <div
        className={`absolute left-0 mt-2 w-max text-xs px-3 py-2 rounded-lg shadow-lg z-10
                    opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                    transition duration-150 pointer-events-none
                    ${mode === "waffle" 
                      ? "bg-yellow-100 text-black border border-yellow-300" 
                      : "bg-zinc-900 text-[#FFD300] border border-[#FFD300]/60"
                    }`}
        role="tooltip"
      >
        {tip}
      </div>
    </div>
  );
}