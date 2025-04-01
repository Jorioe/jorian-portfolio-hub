
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";

export default function Home() {
  const skills = [
    { category: "development" as const, items: ["JavaScript", "TypeScript", "React", "Node.js", "HTML/CSS"] },
    { category: "design" as const, items: ["UI/UX Design", "Figma", "Adobe XD", "Responsive Design"] },
    { category: "research" as const, items: ["User Research", "Market Analysis", "Data Collection", "Academic Writing"] },
    { category: "data" as const, items: ["Data Analysis", "Data Visualization", "SQL", "Excel/Google Sheets"] },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Hallo, ik ben <span className="text-primary">Jorian Bracke</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Student en enthousiaste web developer met passie voor het creëren van mooie, functionele websites en applicaties.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
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
      </section>

      {/* About Me Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Over Mij</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                  alt="Jorian Bracke" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-lg mb-6">
                Ik ben een gepassioneerde student met een sterke interesse in webontwikkeling en design. 
                Mijn reis in de wereld van technologie begon toen ik voor het eerst kennismaakte met 
                HTML en CSS tijdens mijn middelbare schooltijd.
              </p>
              <p className="text-lg mb-6">
                Sindsdien heb ik me verdiept in verschillende programmeertalen en frameworks, 
                waaronder JavaScript, React en Node.js. Ik geniet ervan om creatieve oplossingen 
                te bedenken voor complexe problemen en ben altijd op zoek naar manieren om mijn vaardigheden 
                te verbeteren.
              </p>
              <p className="text-lg">
                Naast programmeren ben ik ook geïnteresseerd in gebruikerservaring, toegankelijkheid 
                en data-analyse. Deze diverse set van interesses stelt me in staat om holistische 
                en gebruikersgerichte oplossingen te creëren.
              </p>
            </div>
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
                <div className="mb-4">
                  <CategoryBadge category={skillGroup.category} />
                </div>
                <ul className="space-y-2">
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
