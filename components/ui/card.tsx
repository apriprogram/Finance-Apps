import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("finance-surface rounded-[22px] p-4 transition-colors duration-200 hover:border-white/90 hover:bg-white/76 sm:p-5 dark:hover:bg-white/8", className)} {...props} />;
}


