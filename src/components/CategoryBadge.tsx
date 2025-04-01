
import { cn } from "@/lib/utils";

type CategoryType = "development" | "design" | "research" | "data";

interface CategoryBadgeProps {
  category: CategoryType;
  className?: string;
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        {
          "bg-category-development text-category-development-foreground": category === "development",
          "bg-category-design text-category-design-foreground": category === "design",
          "bg-category-research text-category-research-foreground": category === "research",
          "bg-category-data text-category-data-foreground": category === "data",
        },
        className
      )}
    >
      {category === "development" && "Ontwikkeling"}
      {category === "design" && "Ontwerp"}
      {category === "research" && "Onderzoek"}
      {category === "data" && "Data"}
    </span>
  );
}
