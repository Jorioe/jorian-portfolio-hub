import { Github, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useHomeContent } from "@/lib/HomeContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { homeContent } = useHomeContent();
  
  // Helper om het juiste icoon te renderen op basis van de naam
  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'github':
        return <Github size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      default:
        // Als er geen icoon is opgegeven, gebruik dan de titel als fallback
        return null;
    }
  };
  
  return (
    <footer className="bg-secondary mt-auto border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <span className="text-sm text-muted-foreground">
              &copy; {currentYear} Jorian Bracke. Alle rechten voorbehouden.
            </span>
          </div>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            {homeContent.footerLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={link.title}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {renderIcon(link.icon) || link.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
