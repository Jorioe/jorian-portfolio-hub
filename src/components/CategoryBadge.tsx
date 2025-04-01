
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
          "bg-[#e1f6ff] text-[#0072b1]": category === "development",
          "bg-[#e7f7e7] text-[#00813c]": category === "design",
          "bg-[#fff4dd] text-[#cc8b00]": category === "research",
          "bg-[#f0e5ff] text-[#5c21d8]": category === "data",
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
