import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";
import { CategoryType } from "@/data/projects";
import { useProjects } from "@/lib/ProjectContext";
import { useHomeContent } from "@/lib/HomeContext";

export default function Home() {
  const { projects, loading: projectsLoading } = useProjects();
  const { homeContent, loading: homeLoading } = useHomeContent();
  
  // Debug logs voor het laden van featured projects
  console.log('Home component - Project IDs:', projects.map(p => p.id));
  console.log('Home component - homeContent.featuredProjects:', homeContent.featuredProjects);
  
  // Gebruik de uitgelichte projecten uit de homeContent
  const featuredProjects = homeContent.featuredProjects && homeContent.featuredProjects.length > 0
    ? homeContent.featuredProjects
        .map(projectId => projects.find(project => project.id === projectId))
        .filter((project): project is typeof projects[0] => project !== undefined)
    : (() => {
        console.log('Geen uitgelichte projecten gevonden, valt terug op eerste 3 projecten');
        return projects.slice(0, 3);
      })(); // Fallback naar de eerste 3 projecten als er geen uitgelichte zijn
  
  console.log('Home component - Resulterende featuredProjects:', featuredProjects.map(p => p.title));

  const skills = [
    { category: "development" as const, items: ["JavaScript", "TypeScript", "React", "HTML/CSS"] },
    { category: "design" as const, items: ["UI/UX Design", "Figma", "Adobe XD", "Responsive Design"] },
    { category: "research" as const, items: ["User Research", "Market Analysis", "Data Collection", "Academic Writing"] },
    { category: "data" as const, items: ["Data Analysis", "Data Visualization", "SQL", "Excel/Google Sheets"] },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span>Hallo, ik ben </span>
                <span className="text-primary">Jorian Bracke</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10">
                {homeContent.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Button asChild size="lg">
                  <Link to="/projects">
                    Bekijk mijn projecten
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">
                    Neem contact op
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={homeContent.heroImage || "img/pfpic.png"} 
                  alt="Jorian Bracke" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">{homeContent.aboutTitle}</h2>
          {homeContent.aboutImage && (
            <div className="md:hidden mb-8">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden max-w-xs mx-auto">
                <img 
                  src={homeContent.aboutImage} 
                  alt="Jorian Bracke" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="space-y-6">
            <p className="text-lg">
              {homeContent.aboutText1}
            </p>
            <p className="text-lg">
              {homeContent.aboutText2}
            </p>
            <p className="text-lg">
              {homeContent.aboutText3}
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Mijn Vaardigheden</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category} className="bg-card rounded-lg p-6 shadow-sm">
                <div className="mb-0">
                  <CategoryBadge category={skillGroup.category} />
                </div>
                <ul className="space-y-2 my-4">
                  {skillGroup.items.map((skill, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Uitgelichte Projecten</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Een selectie van mijn beste projecten. Bekijk mijn complete
              portfolio voor meer.
            </p>
          </div>

          {projectsLoading || homeLoading ? (
            <div className="text-center py-12">Projecten laden...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="block hover:scale-105 transition-transform duration-300">
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm h-full">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild>
              <Link to="/projects" className="flex items-center gap-2">
                Bekijk alle projecten <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title text-center">{homeContent.ctaTitle}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {homeContent.ctaText}
          </p>
          <Button asChild size="lg">
            <Link to="/contact">
              Neem contact op
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
