import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
  tone?: "green" | "blue" | "amber" | "red";
};

export function Progress({ value, className, tone = "green" }: ProgressProps) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          tone === "green" && "bg-[#59a7b7]",
          tone === "blue" && "bg-blue-600",
          tone === "amber" && "bg-amber-400",
          tone === "red" && "bg-rose-500",
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
