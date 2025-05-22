import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink, Instagram } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";
import { useEffect, useState } from "react";
import { useProjects } from "@/lib/ProjectContext";
import { CategoryType, Project } from "@/data/projects";

// Type definities voor content blocks
type ImageSizeType = 'small' | 'medium' | 'large' | 'full';
type ImagePositionType = 'left' | 'right' | 'center';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, loading } = useProjects();
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [zoom, setZoom] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("center center");

  // Veilig decoderen van de project ID
  const safeId = id ? (() => {
    try {
      return decodeURIComponent(id);
    } catch (error) {
      console.error('Error decoding URI component:', error);
      return id;
    }
  })() : '';

  const project = projects.find((p) => p.id === safeId);

  useEffect(() => {
    if (!loading && !project) {
      setNotFound(true);
    }
  }, [loading, project]);

  // Extra check voor project content format
  useEffect(() => {
    if (project && project.content && !Array.isArray(project.content)) {
      console.warn("Project content is not an array:", project.content);
      try {
        if (typeof project.content === 'string') {
          const parsedContent = JSON.parse(project.content);
          if (Array.isArray(parsedContent)) {
            // We can't directly modify the project from the context, 
            // so we reload the page to get the fixed data from our updated getProjects function
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Error parsing project content:", error);
      }
    }
  }, [project]);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const percentX = (offsetX / rect.width) * 100;
    const percentY = (offsetY / rect.height) * 100;

    if (zoom === 1) {
      setTransformOrigin(`${percentX}% ${percentY}%`);
      setZoom(2);
    } else {
      setZoom(1);
      setTransformOrigin("center center");
    }
  };

  if (notFound) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Project niet gevonden</h1>
        <p className="mb-6">Het project dat je zoekt bestaat niet of is verwijderd.</p>
        <Button onClick={() => navigate("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Projecten
        </Button>
      </div>
    );
  }

  if (!project) {
    return <div className="container py-16">Laden...</div>;
  }

  const renderContentItem = (item: any, index: number) => {
    if (item.type === "text") {
      return <p key={index} className="mb-4">{item.content}</p>;
    }
    if (item.type === "break") {
      return <br key={index} />;
    }
    if (item.type === "subtitle") {
      return <h2 key={index} className="text-2xl font-bold my-4">{item.content}</h2>;
    }
    if (item.type === "small-subtitle") {
      return <h3 key={index} className="text-lg font-semibold my-3">{item.content}</h3>;
    }
    if (item.type === "bold-small-subtitle") {
      return <h3 key={index} className="text-lg font-bold my-3">{item.content}</h3>;
    }
    if (item.type === "opsom-text-top") {
      return <p key={index} className="-mt-3">{item.content}</p>;
    }
    if (item.type === "opsom-text") {
      return <p key={index} className="mb-0">{item.content}</p>;
    }
    if (item.type === "opsom-text-bottom") {
      return <p key={index} className="mb-4">{item.content}</p>;
    }
    if (item.type === "quote-top" || item.type === "quote" || item.type === "quote-bottom") {
      return <p key={index} className="italic mb-4">{item.content}</p>;
    }
    if (item.type === "boldtexttop" || item.type === "boldtext") {
      return (
        <p key={index} className={item.type === "boldtexttop" ? "-mt-3" : ""}>
          <span className="font-semibold">{item.content}</span> {item.aditionalContent}
        </p>
      );
    }
    if (item.type === "image") {
      const sizeClasses = {
        small: "w-full max-w-xs",
        medium: "w-full max-w-md",
        large: "w-full max-w-lg",
        full: "w-full",
      };
      const positionClasses = {
        left: "items-start",
        right: "items-end",
        center: "items-center",
      };
      const sizeClass = sizeClasses[item.imageSize as ImageSizeType] || sizeClasses.medium;
      const positionClass = positionClasses[item.imagePosition as ImagePositionType] || positionClasses.center;

      if (!item.content2) {
        return (
          <div key={index} className={`flex flex-col ${positionClass} w-full my-6`}>
            {item.imgtext && (
              <div className={`${sizeClass} mb-2`}>
                <p className="font-semibold text-center">{item.imgtext}</p>
              </div>
            )}
            <div className={`${sizeClass}`}>
              <img
                src={item.content}
                alt=""
                className="cursor-pointer rounded hover:opacity-80 transition w-full h-auto"
                onClick={() => {
                  setModalImage(item.content);
                  setShowModal(true);
                }}
              />
            </div>
          </div>
        );
      }

      // Twee afbeeldingen naast elkaar
      return (
        <div key={index} className={`flex flex-col ${positionClass} w-full my-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {[item.content, item.content2].map((src, i) => (
              <div key={i} className="flex flex-col items-center">
                {i === 0 ? item.imgtext : item.imgtext2 ? (
                  <p className="mb-2 font-semibold text-center">{i === 0 ? item.imgtext : item.imgtext2}</p>
                ) : null}
                <div className="w-full">
                  <img
                    src={src}
                    alt=""
                    className="cursor-pointer rounded hover:opacity-80 transition w-full h-auto"
                    onClick={() => {
                      setModalImage(src);
                      setShowModal(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (item.type === "flex-text") {
      const sizeClasses = {
        small: "w-full sm:w-1/4",
        medium: "w-full sm:w-1/3",
        large: "w-full sm:w-1/2",
        full: "w-full",
      };
      const sizeClass = sizeClasses[item.imageSize as ImageSizeType] || sizeClasses.medium;

      if (!item.imagePosition || item.imagePosition === "center") {
        return (
          <div key={index} className="flex flex-col items-center mb-10 w-full">
            <div className="mb-6 w-full">{item.content}</div>
            <div className={sizeClass}>
              <img
                src={item.content2 || item.image}
                alt=""
                className="cursor-pointer rounded hover:opacity-80 transition w-full h-auto"
                onClick={() => {
                  setModalImage(item.content2 || item.image);
                  setShowModal(true);
                }}
              />
            </div>
          </div>
        );
      }

      return (
        <div key={index} className="flex flex-col sm:flex-row mb-10 gap-6 w-full">
          {item.imagePosition === "left" && (
            <div className={`${sizeClass} shrink-0`}>
              <img
                src={item.content2 || item.image}
                alt=""
                className="cursor-pointer rounded hover:opacity-80 transition w-full h-auto"
                onClick={() => {
                  setModalImage(item.content2 || item.image);
                  setShowModal(true);
                }}
              />
            </div>
          )}
          <div className="flex-1">{item.content}</div>
          {item.imagePosition === "right" && (
            <div className={`${sizeClass} shrink-0`}>
              <img
                src={item.content2 || item.image}
                alt=""
                className="cursor-pointer rounded hover:opacity-80 transition w-full h-auto"
                onClick={() => {
                  setModalImage(item.content2 || item.image);
                  setShowModal(true);
                }}
              />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar projecten
        </Button>

        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
          <div className="aspect-video bg-muted relative overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <CategoryBadge key={category} category={category} />
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground mb-8">{project.date}</p>

            <div className="prose max-w-none mb-8">
              <div className="text-lg mb-6">
                {project.content.map((item, index) => renderContentItem(item, index))}
              </div>

              {project.technologies && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">Gebruikte technologieën</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
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
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" /> Bekijk op GitHub
                  </a>
                </Button>
              )}
              {project.demoLink && (
                <Button asChild>
                  <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                  </a>
                </Button>
              )}
              {project.instagramLink && (
                <Button asChild variant="outline">
                  <a href={project.instagramLink} target="_blank" rel="noopener noreferrer">
                    <Instagram className="mr-2 h-4 w-4" /> Bekijk hier
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-6">Wil je meer projecten bekijken?</h2>
          <Button asChild>
            <Link to="/projects">Terug naar alle projecten</Link>
          </Button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => {
            setShowModal(false);
            setZoom(1);
            setTransformOrigin("center center");
          }}
        >
          <div className="relative flex items-start">
            <div
              className="max-w-6xl max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                onClick={handleImageClick}
                className="select-none transition-transform duration-300 ease-in-out object-contain w-full h-auto"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin,
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  minWidth: "60vw",
                  minHeight: "60vh",
                  borderRadius: "0.5rem",
                  cursor: zoom === 1 ? "zoom-in" : "zoom-out",
                }}
                draggable={false}
              />
            </div>
            <button
              onClick={() => {
                setShowModal(false);
                setZoom(1);
                setTransformOrigin("center center");
              }}
              className="ml-4 text-white text-3xl hover:text-gray-300 z-50"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
