import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 rounded-[12px] border border-slate-200 bg-white px-3.5 text-[14px] text-slate-950 outline-none transition-colors placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500", props.className)} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 rounded-[12px] border border-slate-200 bg-white px-3.5 text-[14px] text-slate-950 outline-none transition-colors hover:border-blue-200 focus:border-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100", props.className)} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-24 rounded-[12px] border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-950 outline-none transition-colors hover:border-blue-200 focus:border-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100", props.className)} {...props} />;
}

