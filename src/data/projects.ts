
export type CategoryType = "development" | "design" | "research" | "data";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: CategoryType[];
  date: string;
  fullDescription?: string;
  technologies?: string[];
  githubLink?: string;
  demoLink?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "E-commerce Webshop",
    description: "Een volledig functionele webshop gebouwd met React en Node.js",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    categories: ["development", "design"],
    date: "Januari 2023",
    fullDescription: "Dit project was een schoolopdracht waarbij ik een volledig functionele e-commerce webshop moest ontwikkelen. De applicatie ondersteunt gebruikersregistratie, productbrowsing, winkelwagen functionaliteit en betalingsverwerking. Ik heb React gebruikt voor de frontend en Node.js met Express voor de backend, met MongoDB als database.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Stripe API"],
    githubLink: "https://github.com",
    demoLink: "https://demo-project.com"
  },
  {
    id: "2",
    title: "Data Visualisatie Dashboard",
    description: "Een interactief dashboard voor het visualiseren van complexe datasets",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    categories: ["data", "development"],
    date: "Maart 2023",
    fullDescription: "Voor dit schoolproject heb ik een interactief dashboard ontwikkeld dat complexe datasets visualiseert op een gebruiksvriendelijke manier. Het dashboard biedt verschillende grafieken en diagrammen die in realtime kunnen worden gefilterd en aangepast. Dit project was vooral gericht op het effectief presenteren van data voor niet-technische gebruikers.",
    technologies: ["D3.js", "React", "TypeScript", "Firebase", "Chart.js"],
    githubLink: "https://github.com"
  },
  {
    id: "3",
    title: "UX/UI Redesign",
    description: "Herontwerp van de gebruikersinterface voor een bestaande mobiele app",
    image: "https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    categories: ["design"],
    date: "April 2023",
    fullDescription: "Dit project betrof het herontwerpen van de gebruikersinterface voor een bestaande mobiele app. Na uitgebreid gebruikersonderzoek heb ik pijnpunten geïdentificeerd en een nieuw ontwerp gecreëerd dat de gebruikerservaring significant verbeterde. Het herontwerp resulteerde in een 40% hogere gebruikerstevredenheid en 25% meer dagelijkse actieve gebruikers.",
    technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "User Testing"],
    demoLink: "https://demo-project.com"
  },
  {
    id: "4",
    title: "Marktonderzoek Sociale Media",
    description: "Uitgebreid onderzoek naar sociale media gebruikspatronen onder jongeren",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    categories: ["research", "data"],
    date: "Mei 2023",
    fullDescription: "Voor dit onderzoeksproject heb ik de sociale media gebruikspatronen onder jongeren tussen 15-25 jaar onderzocht. Het onderzoek omvatte zowel kwalitatieve als kwantitatieve methoden, waaronder enquêtes, interviews en data-analyse. De resultaten boden inzicht in opkomende trends en voorkeursplatformen, wat waardevol was voor marketingstrategieën gericht op deze demografische groep.",
    technologies: ["SPSS", "Google Analytics", "Survey Monkey", "Excel", "Power BI"],
  },
  {
    id: "5",
    title: "Mobiele Fitness App",
    description: "Een fitness app die gepersonaliseerde trainingsschema's genereert",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    categories: ["development", "design"],
    date: "Juni 2023",
    fullDescription: "Ik heb een mobiele fitness app ontwikkeld die gepersonaliseerde trainingsschema's genereert op basis van gebruikersdoelen, ervaring en beschikbare apparatuur. De app houdt voortgang bij, geeft feedback op oefeningstechniek en past schema's aan op basis van prestaties. Dit was een uitdagend project dat me hielp mijn vaardigheden in mobiele app-ontwikkeling te verbeteren.",
    technologies: ["React Native", "Firebase", "Redux", "Node.js", "Express"],
    githubLink: "https://github.com",
    demoLink: "https://demo-project.com"
  },
  {
    id: "6",
    title: "Duurzaamheidsonderzoek",
    description: "Onderzoek naar duurzame praktijken in de IT-sector",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    categories: ["research"],
    date: "Augustus 2023",
    fullDescription: "Dit onderzoeksproject richtte zich op duurzame praktijken in de IT-sector. Ik analyseerde de huidige stand van zaken, identificeerde uitdagingen en mogelijkheden, en stelde aanbevelingen op voor bedrijven om hun ecologische voetafdruk te verkleinen. Het onderzoek benadrukte het belang van groene hosting, energiezuinige datacenters en duurzame softwareontwikkelingspraktijken.",
    technologies: ["Research Methodologies", "Data Analysis", "Academic Writing"],
  },
];
