import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { homeContentService } from './database';
import { useToast } from '@/components/ui/use-toast';

// Interface voor de home content
export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutText3: string;
  aboutImage: string;
  ctaTitle: string;
  ctaText: string;
  featuredProjects: string[]; // IDs van uitgelichte projecten
  featuredProjectsTitle: string;
  featuredProjectsSubtitle: string;
  skillsTitle: string;
  skillsItems: {
    category: string;
    items: string[];
    _tempValue?: string; // Tijdelijk veld voor het opslaan van ruwe invoer
  }[];
  footerLinks: {
    title: string;
    url: string;
    icon?: string;
  }[];
}

// Interface voor de context
interface HomeContextType {
  homeContent: HomeContent;
  updateHomeContent: (content: Partial<HomeContent>) => void;
  loading: boolean;
  migrateToDatabase: () => Promise<void>; // Nieuwe functie voor migratie
  reloadHomeContent: () => Promise<void>; // Nieuwe functie om content opnieuw te laden
}

// Lokale opslag key
const STORAGE_KEY = 'portfolio_home_content';

// Default values
const defaultHomeContent: HomeContent = {
  heroTitle: 'Hallo, ik ben Jorian Bracke',
  heroSubtitle: 'Welkom op mijn portfolio!',
  heroImage: '/img/pfpic.png',
  aboutTitle: 'Over Mij',
  aboutText1: 'Ik ben Jorian Bracke, 21 jaar oud en student HBO-ICT aan Fontys in Tilburg, met een specialisatie in ICT & Media Design. Ik haal veel energie uit het bedenken van creatieve en doordachte oplossingen. Of dat nu gaat om het ontwerpen van een visuele identiteit, of het bouwen van een digitale ervaring.',
  aboutText2: 'Mijn interesses liggen op het snijvlak van design, technologie en beleving. Ik werk graag met tools zoals Photoshop, Illustrator en Figma, maar duik net zo lief in strategieën voor social media, data-analyse of gebruikersonderzoek. Naast mijn studie maak ik muziek. Creatieve expressie loopt als een rode draad door alles wat ik doe.',
  aboutText3: 'Ik ben nieuwsgierig, gedreven en altijd op zoek naar nieuwe manieren om te groeien, zowel persoonlijk als professioneel.',
  aboutImage: '',
  ctaTitle: 'Klaar om samen te werken?',
  ctaText: 'Ik ben altijd op zoek naar nieuwe uitdagingen en samenwerkingen. Laten we in contact komen en bespreken hoe ik jou kan helpen!',
  featuredProjects: [],
  featuredProjectsTitle: 'Uitgelichte Projecten',
  featuredProjectsSubtitle: 'Een selectie van mijn beste projecten. Bekijk mijn complete portfolio voor meer.',
  skillsTitle: 'Mijn Vaardigheden',
  skillsItems: [
    { category: "development", items: ["JavaScript", "TypeScript", "React", "HTML/CSS"] },
    { category: "design", items: ["UI/UX Design", "Figma", "Adobe XD", "Responsive Design"] },
    { category: "research", items: ["User Research", "Market Analysis", "Data Collection", "Academic Writing"] },
    { category: "data", items: ["Data Analysis", "Data Visualization", "SQL", "Excel/Google Sheets"] }
  ],
  footerLinks: [
    { title: "GitHub", url: "https://github.com" },
    { title: "LinkedIn", url: "https://linkedin.com" },
    { title: "Instagram", url: "https://instagram.com" }
  ]
};

// Creëer de context
const HomeContext = createContext<HomeContextType>({
  homeContent: defaultHomeContent,
  updateHomeContent: () => {},
  loading: true,
  migrateToDatabase: async () => {}, // Default waarde
  reloadHomeContent: async () => {}   // Default waarde
});

// Hook om de context te gebruiken
export const useHomeContent = () => useContext(HomeContext);

// Provider component
export const HomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHomeContent);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Laad content bij initialisatie
  useEffect(() => {
    loadHomeContentFromDatabase();
  }, []);

  // Functie om home content uit database te laden
  const loadHomeContentFromDatabase = async () => {
    setLoading(true);
    try {
      console.log('Loading home content from database...');
      const { data, error } = await homeContentService.getHomeContent();
      
      if (error) {
        console.error('Error loading home content from database:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // Fallback naar localStorage
        loadFromLocalStorage();
      } else if (data) {
        console.log('Home content loaded from database:', data);
        
        // Zorg dat alle vereiste velden aanwezig zijn door te mergen met default values
        const mergedContent = {
          ...defaultHomeContent,
          ...data,
          // Handmatig arrays samenvoegen voor specifieke velden
          skillsItems: Array.isArray(data.skillsItems) && data.skillsItems.length 
            ? data.skillsItems 
            : defaultHomeContent.skillsItems,
          footerLinks: Array.isArray(data.footerLinks) && data.footerLinks.length 
            ? data.footerLinks 
            : defaultHomeContent.footerLinks,
          featuredProjects: Array.isArray(data.featuredProjects) && data.featuredProjects.length 
            ? data.featuredProjects 
            : defaultHomeContent.featuredProjects
        };
        
        setHomeContent(mergedContent);
      } else {
        console.log('No home content in database, loading from localStorage');
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load home content from database:', error);
      
      // Fallback naar localStorage
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Functie om home content uit localStorage te laden als fallback
  const loadFromLocalStorage = () => {
    try {
      const storedContent = localStorage.getItem(STORAGE_KEY);
      console.log('HomeContext: Raw stored content from localStorage:', storedContent);
      
      if (storedContent) {
        const parsedContent = JSON.parse(storedContent);
        console.log('HomeContext: Parsed content:', parsedContent);
        
        // Zorg ervoor dat featuredProjects altijd een array is
        if (!parsedContent.featuredProjects) {
          parsedContent.featuredProjects = [];
        }
        
        // Zorg ervoor dat alle arrays en objecten correct worden samengevoegd
        const mergedContent = {
          ...defaultHomeContent,
          ...parsedContent,
          // Handmatig arrays samenvoegen voor specifieke velden
          skillsItems: Array.isArray(parsedContent.skillsItems) && parsedContent.skillsItems.length 
            ? parsedContent.skillsItems 
            : defaultHomeContent.skillsItems,
          footerLinks: Array.isArray(parsedContent.footerLinks) && parsedContent.footerLinks.length 
            ? parsedContent.footerLinks 
            : defaultHomeContent.footerLinks,
          featuredProjects: Array.isArray(parsedContent.featuredProjects) && parsedContent.featuredProjects.length 
            ? parsedContent.featuredProjects 
            : defaultHomeContent.featuredProjects
        };
        
        setHomeContent(mergedContent);
      } else {
        console.log('HomeContext: No stored content found, using defaults');
        setHomeContent(defaultHomeContent);
      }
    } catch (error) {
      console.error('Error loading home content from localStorage:', error);
      setHomeContent(defaultHomeContent);
    }
  };

  // Update de home content
  const updateHomeContent = async (content: Partial<HomeContent>) => {
    setLoading(true);
    
    try {
      const updatedContent = { ...homeContent, ...content };
      setHomeContent(updatedContent);
      
      // Eerst updaten in de database
      const { error } = await homeContentService.updateHomeContent(updatedContent);
      
      if (error) {
        console.error('Error updating home content in database:', error);
        toast({
          title: 'Fout bij opslaan',
          description: 'Kon homepagina content niet opslaan in de database. Opgeslagen in localStorage als fallback.',
          variant: 'destructive',
        });
        
        // Fallback naar localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContent));
      } else {
        console.log('Home content updated in database');
        toast({
          title: 'Content opgeslagen',
          description: 'De homepagina content is succesvol opgeslagen.',
        });
      }
    } catch (error) {
      console.error('Error saving home content:', error);
      
      // Fallback naar localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...homeContent, ...content }));
        toast({
          title: 'Opgeslagen in lokale opslag',
          description: 'De content kon niet worden opgeslagen in de database maar is wel bewaard in lokale opslag.',
          variant: 'destructive',
        });
      } catch (localStorageError) {
        console.error('Error saving to localStorage:', localStorageError);
        toast({
          title: 'Fout bij opslaan',
          description: 'Kon de content niet opslaan. Probeer het later opnieuw.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Functie voor migratie van localStorage naar database
  const migrateToDatabase = async () => {
    setLoading(true);
    
    try {
      console.log('Migrating home content from localStorage to database');
      const { success, error } = await homeContentService.migrateFromLocalStorage();
      
      if (!success) {
        console.error('Error migrating home content to database:', error);
        toast({
          title: 'Fout bij migratie',
          description: 'Kon homepagina content niet migreren naar de database.',
          variant: 'destructive',
        });
      } else {
        console.log('Home content successfully migrated to database');
        toast({
          title: 'Migratie voltooid',
          description: 'De homepagina content is succesvol gemigreerd naar de database.',
        });
        
        // Herlaad de content uit de database
        await loadHomeContentFromDatabase();
        
        // Verwijder lokale opslag na succesvolle migratie
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to migrate home content to database:', error);
      toast({
        title: 'Fout bij migratie',
        description: 'Er is een onverwachte fout opgetreden bij de migratie.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Functie om home content opnieuw te laden
  const reloadHomeContent = async () => {
    try {
      await loadHomeContentFromDatabase();
      toast({
        title: 'Content herladen',
        description: 'De homepagina content is opnieuw geladen uit de database.',
      });
    } catch (error) {
      console.error('Error reloading home content:', error);
      toast({
        title: 'Fout bij herladen',
        description: 'Kon de homepagina content niet opnieuw laden.',
        variant: 'destructive',
      });
    }
  };

  return (
    <HomeContext.Provider value={{ 
      homeContent, 
      updateHomeContent,
      loading,
      migrateToDatabase,
      reloadHomeContent
    }}>
      {children}
    </HomeContext.Provider>
  );
}; 