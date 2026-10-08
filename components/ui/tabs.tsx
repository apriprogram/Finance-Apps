"use client";

import { cn } from "@/lib/utils";

type TabItem<T extends string> = {
  value: T;
  label: string;
};

type TabsProps<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function Tabs<T extends string>({ items, value, onChange }: TabsProps<T>) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-[16px] border border-slate-200 bg-slate-100/80 p-1.5 dark:border-white/10 dark:bg-white/5">
      {items.map((item) => (
        <button
          type="button"
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "h-10 rounded-[11px] text-[12px] font-medium text-slate-500 transition-colors duration-200 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300",
            value === item.value && "border border-slate-800 bg-slate-800 font-semibold text-white dark:border-white/15 dark:bg-slate-600 dark:text-white",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
