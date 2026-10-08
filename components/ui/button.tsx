import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
};

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[12px] border border-transparent font-semibold outline outline-1 outline-transparent transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "float-shadow bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500",
        variant === "secondary" && "glass-surface text-slate-950 hover:bg-white/80 dark:text-slate-100 dark:hover:bg-white/10",
        variant === "ghost" && "text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-blue-300",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-500",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-11 px-4 text-[13px]",
        size === "icon" && "h-10 w-10 rounded-full",
        className,
      )}
      {...props}
    />
  );
}

