"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function MobileSearch({ value, onChange }: SearchInputProps) {
  return (
    <div className="lg:hidden mb-8">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input
          type="text"
          placeholder="搜索..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-zinc-200 outline-none"
        />
      </div>
    </div>
  );
}
