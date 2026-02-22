'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (value: string) => void;
  delay?: number;
  initialValue?: string;
}

export default function SearchBar({ onSearch, delay = 400, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setValue(next);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSearch(next), delay);
    },
    [onSearch, delay]
  );

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Search icon */}
      <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
      </span>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search products, categories…"
        className="
          w-full pl-12 pr-5 py-3.5 rounded-2xl text-sm font-medium
          glass-strong text-white placeholder-white/35
          focus:outline-none focus:ring-2 focus:ring-indigo-400/50
          transition-all duration-300
        "
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => { setValue(''); onSearch(''); }}
          className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white/80 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
