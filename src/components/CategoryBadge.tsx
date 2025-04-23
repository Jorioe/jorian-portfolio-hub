
// import { cn } from "@/lib/utils";

// type CategoryType = "development" | "design" | "research" | "data";

// interface CategoryBadgeProps {
//   category: CategoryType;
//   className?: string;
// }

// export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
//         {
//           "bg-[#e1f6ff] text-[#0072b1]": category === "development",
//           "bg-[#e7f7e7] text-[#00813c]": category === "design",
//           "bg-[#f0e5ff] text-[#5c21d8]": category === "research",
//           "bg-[#fff4dd] text-[#cc8b00]": category === "data",
//         },
//         className
//       )}
//     >
//       {category === "development" && "Ontwikkeling"}
//       {category === "design" && "Ontwerp"}
//       {category === "research" && "Onderzoek"}
//       {category === "data" && "Data"}
//     </span>
//   );
// }

// technologyCategories bovenaan het bestand
const skillCategories = {
  development: ["HTML", "CSS", "Javascript", "React", "Tailwind CSS", "Git", "Development"],
  design: ["Figma", "Adobe XD", "Prototyping", "Photoshop", "Illustrator", "UI/UX", "Design"],	 
  research: ["Google Analytics", "Survey Monkey", "User Testing", "A/B Testing", "Market Research", "Competitor Analysis"],
  data: ["Data Analysis", "Data Visualization", "SQL", "Python", "R", "Machine Learning", "Data"],
  rest: ["Event planning", "Social Media", "Marketing", "Content Creation", "SEO", "Email Marketing", "Rest"],
};

// In CategoryBadge component
import { cn } from "@/lib/utils";

type CategoryType = "development" | "design" | "research" | "data" | "rest";

interface CategoryBadgeProps {
  category: CategoryType;
  className?: string;
  skills?: string[];
}

export default function CategoryBadge({ category, className, skills }: CategoryBadgeProps) {
  const skillForCategory = skills?.filter(skill => skillCategories[category]?.includes(skill));

  return (
    <>
      {skillForCategory?.map((skill) => (
        <span
          key={skill}
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
            {
              "bg-[#e1f6ff] text-[#0072b1]": category === "development",
              "bg-[#e7f7e7] text-[#00813c]": category === "design",
              "bg-[#f0e5ff] text-[#5c21d8]": category === "research",
              "bg-[#fff4dd] text-[#cc8b00]": category === "data",
              "bg-[#ffe5e5] text-[#d80000]": category === "rest",
            },
            className
          )}
        >
          {skill}
        </span>
      ))}
    </>
  );
}
