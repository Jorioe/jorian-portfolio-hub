
import { cn } from "@/lib/utils";

type SkillType = "html" | "saus" | "lekker" | "hoor";

interface SkillBadgeProps {
  skill: SkillType;
  className?: string;
}

export default function skillBadge({ skill, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        {
          "bg-[#e1f6ff] text-[#0072b1]": skill === "html",
          "bg-[#e7f7e7] text-[#00813c]": skill === "saus",
          "bg-[#f0e5ff] text-[#5c21d8]": skill === "lekker",
          "bg-[#fff4dd] text-[#cc8b00]": skill === "hoor",
        },
        className
      )}
    >
      {skill === "html" && "html / css"}
      {skill === "saus" && "dat"}
      {skill === "lekker" && "klopt"}
      {skill === "hoor" && "volledig"}
    </span>
  );
}
