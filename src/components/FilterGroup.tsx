"use client";

import { FilterOption } from "@/lib/types";

interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  active: string;
  onChange: (val: string) => void;
}

export function FilterGroup({ label, options, active, onChange }: FilterGroupProps) {
  return (
    <div className="flex flex-col gap-3 py-4 border-b border-zinc-800/50">
      <div className="flex items-center gap-2 px-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
              active === option.value
                ? "bg-gradient-neon border-transparent text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-emerald-500/50 hover:text-zinc-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
