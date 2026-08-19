import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  selectedValue,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-950/60 border border-slate-800 ${className}`}>
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
              isSelected
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
