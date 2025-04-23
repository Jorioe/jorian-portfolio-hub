import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="bg-card border rounded-lg shadow-lg p-8 md:p-12 max-w-xl w-full mx-4 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          {/* Animated number */}
          <div className="relative mb-4">
            <h1 className="text-9xl font-bold text-primary animate-pulse">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl font-bold text-primary/20 transform -translate-x-2 translate-y-2">404</span>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pagina niet gevonden</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sorry, de pagina die je zoekt bestaat niet of is verplaatst. 
            Laten we je terug naar een bestaande pagina brengen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Terug naar home</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
              <span>Ga terug</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
