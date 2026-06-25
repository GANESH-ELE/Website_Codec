'use client';

import { Zap, Droplet, PaintBucket, LayoutGrid, Tag } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Electricals: Zap,
  Plumbing: Droplet,
  Paints: PaintBucket,
};

interface Props {
  active: string;
  onChange: (cat: string) => void;
  counts?: Partial<Record<string, number>>;
  categories: string[];
}

export default function CategoryFilter({ active, onChange, counts, categories }: Props) {
  const allOption = { value: 'All', label: 'All Products', Icon: LayoutGrid };
  const dynamicOptions = categories.map((cat) => ({
    value: cat,
    label: cat,
    Icon: ICON_MAP[cat] ?? Tag,
  }));

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Category filter">
      {[allOption, ...dynamicOptions].map(({ value, label, Icon }) => {
        const isActive = active === value;
        const count = counts?.[value];
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              isActive
                ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {count !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
