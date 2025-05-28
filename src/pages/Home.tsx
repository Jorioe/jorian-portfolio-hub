import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";
import { CategoryType } from "@/data/projects";
import { useProjects } from "@/lib/ProjectContext";
import { useHomeContent } from "@/lib/HomeContext";
import { useRef, useEffect } from "react";

export default function Home() {
  const { projects, loading: projectsLoading } = useProjects();
  const { homeContent, loading: homeLoading } = useHomeContent();
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Debug logs voor het laden van featured projects
  // console.log('Home component - Project IDs:', projects.map(p => p.id));
  // console.log('Home component - homeContent.featuredProjects:', homeContent.featuredProjects);
  
  // Gebruik de uitgelichte projecten uit de homeContent, maar filter verborgen projecten eruit
  const featuredProjects = homeContent.featuredProjects && homeContent.featuredProjects.length > 0
    ? homeContent.featuredProjects
        .map(projectId => projects.find(project => project.id === projectId))
        .filter((project): project is typeof projects[0] => project !== undefined && !project.hidden)
    : (() => {
        // console.log('Geen uitgelichte projecten gevonden, valt terug op eerste 3 zichtbare projecten');
        return projects.filter(project => !project.hidden).slice(0, 3);
      })(); // Fallback naar de eerste 3 zichtbare projecten als er geen uitgelichte zijn
  
  // console.log('Home component - Resulterende featuredProjects:', featuredProjects.map(p => p.title));

  // Gebruik vaardigheden uit homeContent in plaats van hardcoded waarden
  const skills = homeContent.skillsItems || [];
  
  // Sorteer de tijdlijn-items als ze bestaan, anders gebruik lege array
  const sortedTimelineItems = homeContent.timelineItems && Array.isArray(homeContent.timelineItems) 
    ? [...homeContent.timelineItems].sort((a, b) => {
        // Functie om datum te parsen uit verschillende formaten
        const parseDate = (period) => {
          // Maak een mapping van maandnamen naar nummers
          const months = {
            'jan': 1, 'januari': 1, 'january': 1,
            'feb': 2, 'februari': 2, 'february': 2,
            'mrt': 3, 'maart': 3, 'march': 3, 'mar': 3,
            'apr': 4, 'april': 4,
            'mei': 5, 'may': 5,
            'jun': 6, 'juni': 6, 'june': 6,
            'jul': 7, 'juli': 7, 'july': 7,
            'aug': 8, 'augustus': 8, 'august': 8,
            'sep': 9, 'september': 9, 'sept': 9,
            'okt': 10, 'oktober': 10, 'october': 10, 'oct': 10,
            'nov': 11, 'november': 11,
            'dec': 12, 'december': 12
          };
          
          // Poging om maand + jaar patroon te vinden (bijv. "februari 2024")
          const monthYearPattern = new RegExp(`(${Object.keys(months).join('|')})\\s+(20\\d{2})`, 'i');
          const monthYearMatch = period.toLowerCase().match(monthYearPattern);
          
          if (monthYearMatch) {
            const month = months[monthYearMatch[1].toLowerCase()];
            const year = parseInt(monthYearMatch[2]);
            return new Date(year, month - 1, 1).getTime();
          }
          
          // Als geen maand+jaar patroon, probeer alleen jaar te vinden
          const yearMatch = period.match(/\b(20\d{2})\b/);
          if (yearMatch) {
            return new Date(parseInt(yearMatch[0]), 0, 1).getTime();
          }
          
          return 0; // Kan datum niet parsen
        };
        
        // Haal start- en einddatum uit periode string
        const getDates = (period) => {
          const parts = period.split(/\s*-\s*/); // Split op "-" met mogelijke spaties
          
          if (parts.length >= 2) {
            const startDate = parseDate(parts[0]);
            
            // Check voor "heden", "nu", etc.
            const isOngoing = parts[1].toLowerCase().includes('heden') || 
                             parts[1].toLowerCase().includes('nu') ||
                             parts[1].toLowerCase().includes('present');
            
            const endDate = isOngoing ? 
                          new Date().getTime() + 31536000000 : // Huidige datum + 1 jaar
                          parseDate(parts[1]);
                          
            return [startDate, endDate];
          }
          
          // Als er maar één deel is
          const singleDate = parseDate(period);
          return [singleDate, singleDate];
        };
        
        const [startA, endA] = getDates(a.period);
        const [startB, endB] = getDates(b.period);
        
        // Eerst sorteren op startdatum (oudste eerst)
        if (startA !== startB) {
          return startA - startB;
        }
        
        // Bij gelijke startdatum, sorteer op basis van type (voorkeursordening)
        const typeOrder = {
          "Opleiding": 0,
          "Minor": 1,
          "Stage": 2,
          "Werkervaring": 3,
          "Certificaat": 4,
          "Vrijwilligerswerk": 5
        };
        
        const orderA = typeOrder[a.type] !== undefined ? typeOrder[a.type] : 99;
        const orderB = typeOrder[b.type] !== undefined ? typeOrder[b.type] : 99;
        
        return orderA - orderB;
    }) 
    : [];
  
  // Groepeer items per jaar voor parallelle weergave
  const groupedByYear = {};
  sortedTimelineItems.forEach(item => {
    // Haal het jaar uit de periode
    const match = item.period.match(/\b(20\d{2})\b/);
    const year = match ? match[0] : 'Onbekend';
    
    if (!groupedByYear[year]) {
      groupedByYear[year] = [];
    }
    groupedByYear[year].push(item);
  });
  
  // Drag-to-scroll functionaliteit voor de tijdlijn
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    let momentumID: number;
    let velocity = 0;
    let lastPageX = 0;
    let rafID: number;
    
    // Functie voor inertia scrolling
    const momentum = () => {
      if (Math.abs(velocity) > 0.1) {
        timeline.scrollLeft -= velocity;
        velocity *= 0.95; // Afname factor
        momentumID = requestAnimationFrame(momentum);
      }
    };
    
    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      timeline.classList.add("grabbing");
      startX = e.pageX - timeline.offsetLeft;
      scrollLeft = timeline.scrollLeft;
      lastPageX = e.pageX;
      
      // Cancel any ongoing momentum
      cancelAnimationFrame(momentumID);
      velocity = 0;
      
      // Voorkom tekstselectie tijdens het slepen
      e.preventDefault();
    };
    
    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      timeline.classList.remove("grabbing");
      
      // Start momentum
      momentumID = requestAnimationFrame(momentum);
    };
    
    const onMouseLeave = () => {
      if (isDown) {
        isDown = false;
        timeline.classList.remove("grabbing");
        
        // Start momentum
        momentumID = requestAnimationFrame(momentum);
      }
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      
      const x = e.pageX - timeline.offsetLeft;
      const walk = (x - startX) * 1.2; // Iets langzamer voor preciezere controle
      
      // Bereken velocity voor momentum scrolling
      velocity = (lastPageX - e.pageX) * 0.1;
      lastPageX = e.pageX;
      
      // Smooth animation met requestAnimationFrame
      if (rafID) {
        cancelAnimationFrame(rafID);
      }
      
      rafID = requestAnimationFrame(() => {
        timeline.scrollLeft = scrollLeft - walk;
      });
    };
    
    // Touch events voor mobiele apparaten
    const onTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - timeline.offsetLeft;
      scrollLeft = timeline.scrollLeft;
      lastPageX = e.touches[0].pageX;
      
      // Cancel any ongoing momentum
      cancelAnimationFrame(momentumID);
      velocity = 0;
    };
    
    const onTouchEnd = () => {
      if (!isDown) return;
      isDown = false;
      
      // Start momentum
      momentumID = requestAnimationFrame(momentum);
    };
    
    const onTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      // Voorkom pagina scrollen tijdens horizontale tijdlijn swipe
      e.preventDefault();
      
      const x = e.touches[0].pageX - timeline.offsetLeft;
      const walk = (x - startX) * 1.0; // Nog langzamer voor touch voor betere controle
      
      // Bereken velocity voor momentum scrolling
      velocity = (lastPageX - e.touches[0].pageX) * 0.1;
      lastPageX = e.touches[0].pageX;
      
      // Smooth animation met requestAnimationFrame
      if (rafID) {
        cancelAnimationFrame(rafID);
      }
      
      rafID = requestAnimationFrame(() => {
        timeline.scrollLeft = scrollLeft - walk;
      });
    };
    
    timeline.addEventListener('mousedown', onMouseDown);
    timeline.addEventListener('mouseleave', onMouseLeave);
    timeline.addEventListener('mouseup', onMouseUp);
    timeline.addEventListener('mousemove', onMouseMove);
    
    timeline.addEventListener('touchstart', onTouchStart);
    timeline.addEventListener('touchend', onTouchEnd);
    timeline.addEventListener('touchmove', onTouchMove);
    
    return () => {
      timeline.removeEventListener('mousedown', onMouseDown);
      timeline.removeEventListener('mouseleave', onMouseLeave);
      timeline.removeEventListener('mouseup', onMouseUp);
      timeline.removeEventListener('mousemove', onMouseMove);
      
      timeline.removeEventListener('touchstart', onTouchStart);
      timeline.removeEventListener('touchend', onTouchEnd);
      timeline.removeEventListener('touchmove', onTouchMove);
      
      // Clean up any animation frames
      cancelAnimationFrame(momentumID);
      cancelAnimationFrame(rafID);
    };
  }, []);
  
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span>Hallo, ik ben </span>
                <span className="text-primary">Jorian Bracke</span>
              </h1>
              
              {/* Mobiele versie van de afbeelding tussen titel en subtitel */}
              <div className="md:hidden mb-6">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden max-w-xs mx-auto">
                  <img 
                    src={homeContent.heroImage || "img/pfpic.png"} 
                    alt="Jorian Bracke" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <p className="text-xl md:text-2xl mb-10">
                {homeContent.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Button asChild size="lg">
                  <Link to="/projects">
                    Bekijk mijn projecten
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">
                    Neem contact op
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={homeContent.heroImage || "img/pfpic.png"} 
                  alt="Jorian Bracke" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">{homeContent.aboutTitle}</h2>
          {homeContent.aboutImage && (
            <div className="md:hidden mb-8">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden max-w-xs mx-auto">
                <img 
                  src={homeContent.aboutImage} 
                  alt="Jorian Bracke" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="space-y-6">
            <p className="text-lg">
              {homeContent.aboutText1}
            </p>
            <p className="text-lg">
              {homeContent.aboutText2}
            </p>
            <p className="text-lg">
              {homeContent.aboutText3}
            </p>
          </div>
        </div>
      </section>

      {/* Experience & Education Timeline Section */}
      {homeContent.timelineItems && Array.isArray(homeContent.timelineItems) && homeContent.timelineItems.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-center mb-8">{homeContent.timelineTitle || 'Opleiding & Ervaring'}</h2>
            
            <div className="relative">
              {/* Indicators for more content */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none"></div>
              
              {/* Verbindingslijn die door alle tijdlijn items loopt */}
              <div className="absolute left-8 right-8 h-1 bg-primary/20 top-[108px] z-0"></div>

              {/* Timeline container with grab cursor */}
              <div 
                ref={timelineRef}
                className="flex flex-nowrap overflow-x-auto gap-6 pb-8 pt-2 px-2 snap-x cursor-grab scrollbar-hide select-none"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none', 
                  scrollBehavior: 'auto', // Veranderd van 'smooth' naar 'auto' voor custom inertia
                  WebkitOverflowScrolling: 'touch',
                  scrollSnapType: 'x proximity',
                  overflowX: 'auto',
                  paddingBottom: '20px',
                  touchAction: 'pan-x', // Zorgt voor betere touch handling
                  willChange: 'transform, scroll-position', // Performance optimalisatie
                  transition: 'all 0.2s ease-out' // Subtiele transitie voor soepelere beweging
                }}
              >
                {sortedTimelineItems.map((item, index) => {
                  // Bepaal de kleur van de indicator op basis van het type
                  let dotColorClass = "bg-primary";
                  let badgeColorClass = "bg-primary/10 text-primary";
                  
                  if (item.type === "Stage") {
                    dotColorClass = "bg-cyan-500";
                    badgeColorClass = "bg-cyan-500/10 text-cyan-600";
                  } else if (item.type === "Minor") {
                    dotColorClass = "bg-amber-500";
                    badgeColorClass = "bg-amber-500/10 text-amber-600";
                  } else if (item.type === "Werkervaring") {
                    dotColorClass = "bg-emerald-500";
                    badgeColorClass = "bg-emerald-500/10 text-emerald-600";
                  } else if (item.type === "Certificaat") {
                    dotColorClass = "bg-purple-500";
                    badgeColorClass = "bg-purple-500/10 text-purple-600";
                  }
                  
                  // Controleer of de periode "heden" of "nu" bevat om aan te geven dat het nog loopt
                  const isOngoing = item.period.toLowerCase().includes('heden') || 
                                    item.period.toLowerCase().includes('nu') ||
                                    item.period.toLowerCase().includes('present');
                                    
                  return (
                    <div 
                      key={index} 
                      className={`snap-start min-w-[280px] md:min-w-[350px] flex-shrink-0 bg-card rounded-lg shadow-md p-6 border ${isOngoing ? 'border-' + dotColorClass.replace('bg-', '') + '/50 shadow-lg shadow-' + dotColorClass.replace('bg-', '') + '/10' : 'border-border/30'} hover:shadow-lg transition-all duration-300 hover:border-primary/20 relative z-10`}
                    >
                      {isOngoing && (
                        <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-green-500 text-white text-[10px] font-medium rounded-sm uppercase tracking-wider">
                          Lopend
                        </div>
                      )}
                      
                      {/* Indicator dot op de tijdlijn voor dit item */}
                      <div className={`absolute w-4 h-4 rounded-full ${dotColorClass} border-2 border-background shadow-sm left-1/2 -translate-x-1/2 -top-[10px] ${isOngoing ? 'animate-pulse-slow' : ''}`}></div>
                      
                      <div className="mb-4 flex flex-wrap gap-x-2 text-xs md:text-sm">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                          {item.period}
                          {isOngoing && (
                            <span className="ml-1 inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          )}
                        </span>
                        {item.type && (
                          <span className={`${badgeColorClass} px-3 py-1 rounded-full font-medium`}>
                            {item.type}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                      {(item.institution || item.company) && (
                        <p className="text-muted-foreground mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {item.institution || item.company}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm md:text-base text-muted-foreground/90 border-t border-border/40 pt-3 mt-2">{item.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Helper text */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                {/* <span className="hidden md:inline">Sleep horizontaal</span> */}
                <span className="md:hidden">Swipe</span>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">{homeContent.skillsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category} className="bg-card rounded-lg p-6 shadow-sm">
                <div className="mb-0">
                  <CategoryBadge category={skillGroup.category as CategoryType} />
                </div>
                <ul className="space-y-2 my-4">
                  {skillGroup.items.map((skill, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Uitgelichte Projecten</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Een selectie van mijn beste projecten. Bekijk mijn complete
              portfolio voor meer.
            </p>
          </div>

          {projectsLoading || homeLoading ? (
            <div className="text-center py-12">Projecten laden...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="block hover:scale-105 transition-transform duration-300">
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm h-full">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild>
              <Link to="/projects" className="flex items-center gap-2">
                Bekijk alle projecten <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title text-center">{homeContent.ctaTitle}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {homeContent.ctaText}
          </p>
          <Button asChild size="lg">
            <Link to="/contact">
              Neem contact op
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
