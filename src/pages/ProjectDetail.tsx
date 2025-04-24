import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink, Instagram } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";
import { useEffect, useState } from "react";
import { useProjects } from "@/lib/ProjectContext";
import { CategoryType } from "@/data/projects";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);
  const { projects, loading } = useProjects();
  
  // Veilig decoderen van de project ID
  const safeId = id ? (() => {
    try {
      return decodeURIComponent(id);
    } catch (error) {
      console.error('Error decoding URI component:', error);
      return id; // Gebruik de originele ID als fallback
    }
  })() : '';
  
  // Vind het project
  const project = projects.find((p) => p.id === safeId);

  useEffect(() => {
    // Als de projecten geladen zijn en het project niet gevonden is
    if (!loading && !project) {
      setNotFound(true);
    }
  }, [project, loading]);

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

  if (!project) return <div className="container py-16">Laden...</div>;

  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [zoom, setZoom] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("center center");

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

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
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
                {project.content.map((item, index) => {
                  if (item.type === "text") {
                    return <p key={index} className="mb-4">{item.content}</p>;
                  } else if (item.type === "break") {
                    return <br key={index} />;
                  } else if (item.type === "subtitle") {
                    return <h2 key={index} className="text-2xl font-bold my-4">{item.content}</h2>;
                  } else if (item.type === "small-subtitle") {
                    return <h3 key={index} className="text-lg font-semibold my-3">{item.content}</h3>;
                  } else if (item.type === "bold-small-subtitle") {
                    return <h3 key={index} className="text-lg font-bold my-3">{item.content}</h3>;
                  } else if (item.type === "opsom-text-top") {
                    return <p key={index} className="-mt-3">{item.content}</p>;
                  } else if (item.type === "opsom-text") {
                    return <p key={index} className="mb-0">{item.content}</p>;
                  } else if (item.type === "opsom-text-bottom") {
                    return <p key={index} className="mb-4">{item.content}</p>;
                  } else if (item.type === "quote-top") {
                    return <p key={index} className="-mt-3 italic">{item.content}</p>;
                  } else if (item.type === "quote") {
                    return <p key={index} className="mb-0 italic">{item.content}</p>;
                  } else if (item.type === "quote-bottom") {
                    return <p key={index} className="mb-4 italic">{item.content}</p>;
                  } else if (item.type === "boldtexttop") {
                    return (
                    <p key={index} className="-mt-3">
                      <span key={index} className="mb-0 font-semibold">{item.content}</span> {item.aditionalContent}
                    </p>
                  );
                  } else if (item.type === "boldtext") {
                    return (
                    <p key={index}>
                      <span key={index} className="mb-0 font-semibold">{item.content}</span> {item.aditionalContent}
                    </p>
                  );
                  } else if (item.type === "image") {
                    return (
                      <div key={index} className="grid grid-cols-2 gap-2 my-4">
                        <div>
                          <p className="mb-0 font-semibold">{item.imgtext}</p>
                        <img
                          src={item.content}
                          className="cursor-pointer rounded hover:opacity-80 transition"
                          onClick={() => {
                            setModalImage(item.content);
                            setShowModal(true);
                          }}
                        />
                        </div>
                        <div>
                        <p className="mb-0 font-semibold">{item.imgtext2}</p>
                          <img
                            src={item.content2}
                            className="cursor-pointer rounded-lg hover:opacity-80 transition"
                            onClick={() => {
                              setModalImage(item.content2);
                              setShowModal(true);
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                  else if (item.type === "flex-text") {
                    return (
                      <div key={index} className="flex mb-20">
                        {/* Text takes up 60% of the space */}
                        <p className="flex-1 mr-20">{item.content}</p>
                        {/* Image takes up 40% of the space and scales correctly */}
                        <img
                          src={item.image} // Assuming you have a separate property for the image source
                          className="cursor-pointer flex-initial w-2/5 h-auto rounded-lg"  // Width set to 40% and height auto to maintain aspect ratio
                          onClick={() => {
                            setModalImage(item.image);
                            setShowModal(true);
                          }}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </p>

              <div className="mb-4 flex flex-auto justify-start gap-2">
                <p className="text-lg mb-6">
                  {project.fullDescription2}
                </p>
                <div className="mb-4 flex flex-auto gap-2">
                  <img
                    src={project.image2}
                    className="cursor-pointer"
                    onClick={() => {
                      setModalImage(project.image2);
                      setShowModal(true);
                    }}
                  />
                </div>
              </div>

              {project.technologies && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">Gebruikte technologieën</h2>
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
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Bekijk op GitHub
                  </a>
                </Button>
              )}
              
              {project.demoLink && (
                <Button asChild>
                  <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              
              {project.instagramLink && (
                <Button asChild variant="outline">
                  <a href={project.instagramLink} target="_blank" rel="noopener noreferrer">
                    <Instagram className="mr-2 h-4 w-4" />
                    Bekijk hier
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

    {/* ✅ Modal met zoom op klikpositie */}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(e);
                }}
                className="select-none transition-transform duration-300 ease-in-out object-contain w-full h-auto"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: transformOrigin,
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  minWidth: "60vw",     // ensures small images are displayed larger
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

