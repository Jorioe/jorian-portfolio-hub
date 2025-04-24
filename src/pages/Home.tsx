import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";
import { CategoryType } from "@/data/projects";
import { useProjects } from "@/lib/ProjectContext";

export default function Home() {
  const { projects, loading } = useProjects();
  
  // Toon alleen de eerste 3 projecten op de homepage
  const featuredProjects = projects.slice(0, 3);

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
                Hallo, ik ben <span className="text-primary">Jorian Bracke</span>
              </h1>
              {/* <p className="text-xl md:text-2xl mb-10">
                Student en enthousiaste web developer met passie voor het creëren van mooie, functionele websites en applicaties.
              </p> */}
              <p className="text-xl md:text-2xl mb-10">
                Welkom op mijn portfolio!
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
                  src="img/pfpic.png" 
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
          <h2 className="section-title text-center">Over Mij</h2>
          <div className="md:hidden mb-8">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden max-w-xs mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                alt="Jorian Bracke" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-lg">
            Ik ben Jorian Bracke, 21 jaar oud en student HBO-ICT aan Fontys in Tilburg, met een specialisatie in ICT & Media Design. Ik haal veel energie uit het bedenken van creatieve en doordachte oplossingen. Of dat nu gaat om het ontwerpen van een visuele identiteit, of het bouwen van een digitale ervaring.
            </p>
            <p className="text-lg">
            Mijn interesses liggen op het snijvlak van design, technologie en beleving. Ik werk graag met tools zoals Photoshop, Illustrator en Figma, maar duik net zo lief in strategieën voor social media, data-analyse of gebruikersonderzoek. Naast mijn studie maak ik muziek. Creatieve expressie loopt als een rode draad door alles wat ik doe.
            </p>
            <p className="text-lg">
            Ik ben nieuwsgierig, gedreven en altijd op zoek naar nieuwe manieren om te groeien, zowel persoonlijk als professioneel.
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
            <h2 className="text-3xl font-bold mb-2">Recente Projecten</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Een selectie van mijn meest recente projecten. Bekijk mijn complete
              portfolio voor meer.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Projecten laden...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <div key={project.id} className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
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
          <h2 className="section-title text-center">Klaar om samen te werken?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ik ben altijd op zoek naar nieuwe uitdagingen en samenwerkingen. 
            Laten we in contact komen en bespreken hoe ik jou kan helpen!
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
