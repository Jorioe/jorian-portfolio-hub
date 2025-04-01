
import { useRef } from "react";

type CategoryType = "development" | "design" | "research" | "data";

interface CategoryBadgeProps {
  category: CategoryType;
  className?: string;
}

export default function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const getTranslation = () => {
    switch (category) {
      case "development":
        return "Ontwikkeling";
      case "design":
        return "Ontwerp";
      case "research":
        return "Onderzoek";
      case "data":
        return "Data";
      default:
        return category;
    }
  };

  return (
    <span
      className={`category-badge category-${category} ${className}`}
    >
      {getTranslation()}
    </span>
  );
}
