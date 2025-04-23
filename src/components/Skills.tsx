import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import "./styles/Skills.css";

interface SkillCategory {
  name: string;
  skills: string[];
  colorClass: string;
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Programmeren",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Python"],
    colorClass: "programming-badge"
  },
  {
    name: "Design",
    skills: ["UI/UX Design", "Figma", "Adobe Photoshop", "Wireframing", "Prototyping"],
    colorClass: "design-badge"
  },
  {
    name: "Data Analyse",
    skills: ["Excel", "SQL", "Data Visualisatie", "Statistische Analyse", "Power BI"],
    colorClass: "data-badge"
  },
  {
    name: "Soft Skills",
    skills: ["Communicatie", "Teamwork", "Probleemoplossend denken", "Presentatie", "Tijdmanagement"],
    colorClass: "soft-skills-badge"
  }
];

const Skills = () => {
  return (
    <section className="skills-section">
      <div className="container">
        <div className="skills-header">
          <Briefcase className="skills-icon" />
          <h2 className="skills-title">Vaardigheden</h2>
        </div>
        
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div key={index} className="skills-card">
              <h3 className="category-title">{category.name}</h3>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <Badge 
                    key={skillIndex} 
                    className={`skill-badge ${category.colorClass}`}
                    variant="outline"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;