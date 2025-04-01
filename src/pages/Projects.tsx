
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";
import { projects, CategoryType } from "@/data/projects";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);

  const categories: { label: string; value: CategoryType }[] = [
    { label: "Ontwikkeling", value: "development" },
    { label: "Ontwerp", value: "design" },
    { label: "Onderzoek", value: "research" },
    { label: "Data", value: "data" },
  ];

  const toggleCategory = (category: CategoryType) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by categories
      const matchesCategories =
        selectedCategories.length === 0 ||
        project.categories.some((category) =>
          selectedCategories.includes(category)
        );

      return matchesSearch && matchesCategories;
    });
  }, [searchQuery, selectedCategories]);

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-b from-secondary to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Mijn Projecten
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Bekijk mijn schoolprojecten en persoonlijke werk. Elk project demonstreert verschillende vaardigheden en technieken.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Zoek projecten..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={
                      selectedCategories.includes(category.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleCategory(category.value)}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        category.value === "development"
                          ? "bg-category-development"
                          : category.value === "design"
                          ? "bg-category-design"
                          : category.value === "research"
                          ? "bg-category-research"
                          : "bg-category-data"
                      }`}
                    ></span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Geen projecten gevonden</h3>
                <p className="text-muted-foreground">
                  Probeer andere zoektermen of filter categorieën.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.categories.map((category) => (
                        <CategoryBadge
                          key={category}
                          category={category}
                        />
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {project.date}
                      </span>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/projects/${project.id}`}>
                          Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
