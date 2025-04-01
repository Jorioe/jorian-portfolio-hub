
import { Github, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg">Jorian Bracke</span>
          </div>
          
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {currentYear} Jorian Bracke. Alle rechten voorbehouden.
          </div>
        </div>
      </div>
    </footer>
  );
}
