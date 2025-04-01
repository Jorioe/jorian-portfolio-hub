
import { Github, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <span className="text-sm">
              &copy; {currentYear} Jorian Bracke. Alle rechten voorbehouden.
            </span>
          </div>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="nav-link"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              className="nav-link"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="nav-link"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
