import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  loading: true
});

// Hook om de context te gebruiken
export const useHomeContent = () => useContext(HomeContext);

// Provider component
export const HomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHomeContent);
  const [loading, setLoading] = useState(true);

  // Laad content bij initialisatie
  useEffect(() => {
    const loadHomeContent = () => {
      try {
        const storedContent = localStorage.getItem(STORAGE_KEY);
        console.log('HomeContext: Raw stored content from localStorage:', storedContent);
        
        if (storedContent) {
          const parsedContent = JSON.parse(storedContent);
          console.log('HomeContext: Parsed content:', parsedContent);
          console.log('HomeContext: Original featuredProjects from storage:', parsedContent.featuredProjects);
          
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
          
          console.log('HomeContext: Final merged featuredProjects:', mergedContent.featuredProjects);
          setHomeContent(mergedContent);
        } else {
          console.log('HomeContext: No stored content found, using defaults');
          setHomeContent(defaultHomeContent);
        }
      } catch (error) {
        console.error('Error loading home content:', error);
        setHomeContent(defaultHomeContent);
      } finally {
        setLoading(false);
      }
    };

    loadHomeContent();
  }, []);

  // Update de home content
  const updateHomeContent = (content: Partial<HomeContent>) => {
    const updatedContent = { ...homeContent, ...content };
    setHomeContent(updatedContent);
    
    try {
      console.log('Saving featuredProjects:', updatedContent.featuredProjects);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContent));
    } catch (error) {
      console.error('Error saving home content:', error);
    }
  };

  return (
    <HomeContext.Provider value={{ 
      homeContent, 
      updateHomeContent,
      loading
    }}>
      {children}
    </HomeContext.Provider>
  );
}; 