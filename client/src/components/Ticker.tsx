import { useEffect, useState } from 'react';

interface TickerProps {
  className?: string;
}

export function Ticker({ className = '' }: TickerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 100); // Update every 100ms for smooth timecode

    return () => clearInterval(interval);
  }, []);

  const formatTimecode = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const tickerMessages = [
    "BREAKING: Static buffet now serving unlimited public domain chaos",
    "ARCHIVE.ORG API STATUS: NOMINAL",
    "CURRENT FEED: LIVE TRANSMISSION FROM NULL-Ø",
    "AUDIO REACTIVE: STANDBY MODE",
    "EMERGENCY MIX PROTOCOL: READY",
    "LICENSE COMPLIANCE: ALL CLEAR",
    "SIGNAL STRENGTH: 97% AND HOLDING",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, [tickerMessages.length]);

  return (
    <div className={`bg-black/50 overflow-hidden ${className}`}>
      <div className="px-4 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
            <span className="text-lime-500 font-bold">REC • LIVE</span>
          </div>
          <div className="text-cyan-500">
            <span>NULL-Ø</span>
          </div>
          <div className="text-gray-400">
            <span data-testid="timecode">{formatTimecode(currentTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-orange-500">
            <span>SIGNAL: 97%</span>
          </div>
          <div className="text-gray-400">
            <span>FRAME: 23.976</span>
          </div>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="relative h-6 bg-black/30 overflow-hidden">
        <div 
          className="absolute whitespace-nowrap py-1 text-xs font-mono text-lime-500 animate-ticker"
          style={{
            animation: 'ticker 30s linear infinite',
          }}
        >
          {tickerMessages.map((message, index) => (
            <span key={index} className="mr-16">
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
