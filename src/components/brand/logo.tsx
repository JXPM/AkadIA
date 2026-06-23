import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showText = true,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 group", className)}>
      <span className="grid size-9 place-items-center rounded-xl gradient-brand text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
        A
      </span>
      {showText && (
        <span className="text-lg font-bold tracking-tight">
          AKADIA
        </span>
      )}
    </Link>
  );
}
