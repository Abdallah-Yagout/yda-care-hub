import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  const { locale } = useLocale();

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground py-4",
        className
      )}
    >
      <Link
        to={`/${locale}`}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast && "text-foreground font-medium"
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};
