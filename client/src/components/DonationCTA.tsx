import React, { useState } from "react";
import { useStore } from "@/lib/store";
const KO_FI_URL = "https://ko-fi.com/staticbuffet";
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
interface DonationCTAProps {
    href?: string;
}
export default function DonationCTA({ href = KO_FI_URL }: DonationCTAProps) {
    const { brandSkin } = useStore();
    const mode = 'ebn';
    const [tip, setTip] = useState(rand(tips[mode] || tips.ebn));
    const label = "Send a Signal";
    const btnBase = "px-4 py-2 rounded-2xl font-semibold transition transform active:scale-[0.98] focus:outline-none focus:ring";
    const btnEbn = "bg-black text-[#FFD300] border border-[#FFD300]/60 hover:bg-zinc-900 ring-yellow-400";
    const openKoFi = () => window.open(href, "_blank", "noopener,noreferrer");
    return (<div className="relative inline-block group">
      <button className={`${btnBase} ${btnEbn}`} onMouseEnter={() => setTip(rand(tips[mode] || tips.ebn))} onClick={openKoFi} aria-label={`${label} — opens Ko-fi in a new tab`} data-testid="button-donate">
        {label}
      </button>

      {/* Tooltip */}
      <div className={`absolute left-0 mt-2 w-max text-xs px-3 py-2 rounded-lg shadow-lg z-10
                    opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                    transition duration-150 pointer-events-none
                    bg-zinc-900 text-[#FFD300] border border-[#FFD300]/60`} role="tooltip">
        {tip}
      </div>
    </div>);
}
