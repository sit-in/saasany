import { Link } from "@/i18n/navigation";
import { getAdjacentDocs } from "@/config/docs";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DocsPagerProps {
  currentSlug: string;
  titles: Record<string, string>;
}

export function DocsPager({ currentSlug, titles }: DocsPagerProps) {
  const { prev, next } = getAdjacentDocs(currentSlug);

  return (
    <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          href={`/docs/${prev}`}
          className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {titles[prev] || prev}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/docs/${next}`}
          className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {titles[next] || next}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
