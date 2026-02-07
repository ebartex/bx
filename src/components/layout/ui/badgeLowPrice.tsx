import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeLowPriceProps = {
  label?: string;
  className?: string;
};

export function BadgeLowPrice({
  label = "Najtańszy",
  className,
}: BadgeLowPriceProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        `
        absolute top-2 right-2
        h-5 min-w-5 px-2
        rounded-sm
        bg-primary text-primary-foreground
        text-[11px] font-medium
        tabular-nums
        shadow-sm
        `,
        className
      )}
    >
      {label}
    </Badge>
  );
}
