
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";
import { projects } from "@/data/projects";
import { useEffect } from "react";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const project = projects.find((p) => p.id === id);
  
  useEffect(() => {
    if (!project) {
      navigate("/projects", { replace: true });
    }
  }, [project, navigate]);
  
  if (!project) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar projecten
        </Button>

        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
          <div className="aspect-video bg-muted relative overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <CategoryBadge key={category} category={category} />
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {project.title}
            </h1>
            
            <p className="text-muted-foreground mb-8">
              {project.date}
            </p>

            <div className="prose max-w-none mb-8">
              <p className="text-lg mb-6">
                {project.fullDescription || project.description}
              </p>
              
              {project.technologies && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Gebruikte technologieën</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {project.githubLink && (
                <Button asChild variant="outline">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Bekijk op GitHub
                  </a>
                </Button>
              )}
              
              {project.demoLink && (
                <Button asChild>
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-6">Wil je meer projecten bekijken?</h2>
          <Button asChild>
            <Link to="/projects">
              Terug naar alle projecten
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
