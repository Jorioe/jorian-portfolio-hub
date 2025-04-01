
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg">Jorian Bracke</span>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/projects" className="text-foreground hover:text-primary transition-colors">
              Projecten
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {currentYear} Jorian Bracke. Alle rechten voorbehouden.
          </div>
        </div>
      </div>
    </footer>
  );
}
