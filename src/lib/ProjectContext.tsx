import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, projects as initialProjects } from '@/data/projects';
import { projectsService } from './database';
import { useToast } from '@/components/ui/use-toast';

// Definieer het type voor de context
interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  updateProjects: (newProjects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  resetProjects: () => void;
  migrateToDatabase: () => Promise<void>; // Nieuwe functie voor migratie
  reloadProjects: () => Promise<void>; // Nieuwe functie om projecten opnieuw te laden
  toggleProjectVisibility: (id: string) => Promise<void>; // Nieuwe functie om projecten te verbergen/tonen
}

// Creëer de context met een default waarde
const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  loading: true,
  updateProjects: () => {},
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  resetProjects: () => {},
  migrateToDatabase: async () => {},
  reloadProjects: async () => {}, // Default waarde
  toggleProjectVisibility: async () => {}, // Default waarde
});

// Hook om de context te gebruiken
export const useProjects = () => useContext(ProjectContext);

// Provider component
export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Laad projecten bij initialisatie
  useEffect(() => {
    loadProjectsFromDatabase();
  }, []);

  // Functie om projecten uit database te laden
  const loadProjectsFromDatabase = async () => {
    setLoading(true);
    try {
      console.log('Loading projects from database...');
      const { data, error } = await projectsService.getProjects();
      
      console.log('Database response:', { 
        dataExists: !!data, 
        dataLength: data?.length || 0, 
        errorExists: !!error 
      });
      
      if (error) {
        console.error('Error loading projects from database:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        toast({
          title: 'Fout bij laden',
          description: `Kon projecten niet laden uit de database: ${error.message || error.code || 'Onbekende fout'}`,
          variant: 'destructive',
        });
        
        console.log('Falling back to initial projects');
        setProjects(initialProjects);
      } else if (data && data.length > 0) {
        console.log('Projects loaded from database:', data);
        try {
          // Extra validatie van projecten uit de database
          data.forEach((project, index) => {
            console.log(`Validating project ${index}:`, project.id, project.title);
            if (!project.id || !project.title || !project.description) {
              console.warn(`Project ${index} missing required fields:`, project);
            }
            
            // Check dat content een array is
            if (!Array.isArray(project.content)) {
              console.error(`Project ${index} content is not an array:`, project.content);
            }
          });
          
          setProjects(data);
          console.log('Projects state updated with database data');
        } catch (validationError) {
          console.error('Error validating projects from database:', validationError);
          setProjects(initialProjects);
        }
      } else {
        // Geen projecten in database, probeer te repareren met initiële projecten
        console.log('No projects in database, attempting repair...');
        
        try {
          const { success, error: repairError } = await projectsService.repairDatabaseWithInitialData();
          
          if (success) {
            console.log('Database repaired successfully, loading repaired data');
            // Laad de gerepareerde projecten
            const { data: repairedData, error: reloadError } = await projectsService.getProjects();
            
            if (reloadError || !repairedData || repairedData.length === 0) {
              console.error('Error loading repaired projects:', reloadError);
              setProjects(initialProjects);
            } else {
              console.log('Repaired projects loaded successfully:', repairedData.length);
              setProjects(repairedData);
              
              toast({
                title: 'Database gerepareerd',
                description: 'De projecten zijn hersteld uit de initiële data.',
              });
            }
          } else {
            console.error('Failed to repair database:', repairError);
            setProjects(initialProjects);
            
            toast({
              title: 'Fout bij reparatie',
              description: 'Kon de database niet repareren, fallback naar initiële data.',
              variant: 'destructive',
            });
          }
        } catch (repairError) {
          console.error('Error during database repair:', repairError);
          setProjects(initialProjects);
        }
      }
    } catch (error) {
      console.error('Failed to load projects, using initial data:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      setProjects(initialProjects);
    } finally {
      setLoading(false);
    }
  };

  // Functie om de volledige projectenlijst bij te werken
  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    // We updaten niet de hele lijst in de database - gebruik individuele CRUD operaties
  };

  // Functie om een enkel project toe te voegen
  const addProject = async (project: Project) => {
    setLoading(true);
    try {
      const { data, error } = await projectsService.addProject(project);
      
      if (error) {
        console.error('Error adding project to database:', error);
        toast({
          title: 'Fout bij toevoegen',
          description: 'Kon project niet toevoegen aan de database.',
          variant: 'destructive',
        });
      } else {
        console.log('Project toegevoegd:', data);
        // Herlaad alle projecten om zeker te zijn van up-to-date data
        await loadProjectsFromDatabase();
        toast({
          title: 'Project toegevoegd',
          description: `${project.title} is toegevoegd aan de database.`,
        });
      }
    } catch (error) {
      console.error('Failed to add project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Functie om een enkel project bij te werken
  const updateProject = async (project: Project) => {
    setLoading(true);
    try {
      const { data, error } = await projectsService.updateProject(project);
      
      if (error) {
        console.error('Error updating project in database:', error);
        toast({
          title: 'Fout bij bijwerken',
          description: 'Kon project niet bijwerken in de database.',
          variant: 'destructive',
        });
      } else {
        console.log('Project bijgewerkt:', data);
        // Herlaad alle projecten om zeker te zijn van up-to-date data
        await loadProjectsFromDatabase();
        toast({
          title: 'Project bijgewerkt',
          description: `${project.title} is bijgewerkt in de database.`,
        });
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Functie om een project te verwijderen
  const deleteProject = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await projectsService.deleteProject(id);
      
      if (error) {
        console.error('Error deleting project from database:', error);
        toast({
          title: 'Fout bij verwijderen',
          description: 'Kon project niet verwijderen uit de database.',
          variant: 'destructive',
        });
      } else {
        console.log('Project verwijderd:', id);
        // Herlaad alle projecten om zeker te zijn van up-to-date data
        await loadProjectsFromDatabase();
        toast({
          title: 'Project verwijderd',
          description: 'Project is verwijderd uit de database.',
        });
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Functie om projecten te resetten naar de initiële data
  const resetProjects = async () => {
    setLoading(true);
    try {
      const { error } = await projectsService.resetWithInitialData(initialProjects);
      
      if (error) {
        console.error('Error resetting projects in database:', error);
        toast({
          title: 'Fout bij resetten',
          description: 'Kon projecten niet resetten in de database.',
          variant: 'destructive',
        });
      } else {
        console.log('Projecten gereset naar initiële data');
        // Herlaad alle projecten
        await loadProjectsFromDatabase();
        toast({
          title: 'Projecten gereset',
          description: 'Alle projecten zijn gereset naar de initiële data.',
        });
      }
    } catch (error) {
      console.error('Failed to reset projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Functie voor migratie van localStorage naar database
  const migrateToDatabase = async () => {
    setLoading(true);
    try {
      // Haal eerst lokaal opgeslagen projecten op
      const localStorageKey = 'portfolio_projects';
      const storedData = localStorage.getItem(localStorageKey);
      
      if (storedData) {
        const localProjects = JSON.parse(storedData);
        console.log('Migreren van localStorage projecten naar database:', localProjects);
        
        // Reset database met lokale projecten
        const { error } = await projectsService.resetWithInitialData(localProjects);
        
        if (error) {
          console.error('Error migrating projects to database:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          toast({
            title: 'Fout bij migratie',
            description: `Kon projecten niet migreren naar de database: ${error.message || error.code || 'Onbekende fout'}`,
            variant: 'destructive',
          });
        } else {
          // Verwijder lokale opslag na succesvolle migratie
          localStorage.removeItem(localStorageKey);
          console.log('Projecten succesvol gemigreerd naar database');
          
          // Herlaad projecten uit database
          await loadProjectsFromDatabase();
          
          toast({
            title: 'Migratie voltooid',
            description: 'Projecten zijn succesvol gemigreerd van localStorage naar de database.',
          });
        }
      } else {
        console.log('Geen lokaal opgeslagen projecten gevonden voor migratie');
        toast({
          title: 'Geen migratie nodig',
          description: 'Geen lokaal opgeslagen projecten gevonden om te migreren.',
        });
      }
    } catch (error) {
      console.error('Failed to migrate projects to database:', error);
      console.error('Error details:', error instanceof Error ? error.message : JSON.stringify(error, null, 2));
      
      toast({
        title: 'Fout bij migratie',
        description: `Er is een onverwachte fout opgetreden: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Declareer en exporteer de reload functie
  const reloadProjects = async () => {
    try {
      await loadProjectsFromDatabase();
      toast({
        title: 'Projecten herladen',
        description: 'Projecten zijn opnieuw geladen uit de database.',
      });
    } catch (error) {
      console.error('Error reloading projects:', error);
      toast({
        title: 'Fout bij herladen',
        description: 'Kon projecten niet opnieuw laden.',
        variant: 'destructive',
      });
    }
  };

  // Functie om de zichtbaarheid van een project te schakelen
  const toggleProjectVisibility = async (id: string) => {
    setLoading(true);
    try {
      // Vind het project in de huidige lijst
      const project = projects.find(p => p.id === id);
      
      if (!project) {
        console.error('Project niet gevonden:', id);
        toast({
          title: 'Fout bij wijzigen zichtbaarheid',
          description: 'Project niet gevonden.',
          variant: 'destructive',
        });
        return;
      }
      
      // Toggle de hidden eigenschap
      const updatedProject = { 
        ...project, 
        hidden: !project.hidden 
      };
      
      // Update in de database
      const { error } = await projectsService.updateProject(updatedProject);
      
      if (error) {
        console.error('Error toggling project visibility:', error);
        toast({
          title: 'Fout bij wijzigen zichtbaarheid',
          description: 'Kon de zichtbaarheid van het project niet wijzigen.',
          variant: 'destructive',
        });
      } else {
        // Herlaad alle projecten om zeker te zijn van up-to-date data
        await loadProjectsFromDatabase();
        toast({
          title: 'Zichtbaarheid gewijzigd',
          description: `${project.title} is nu ${updatedProject.hidden ? 'verborgen' : 'zichtbaar'}.`,
        });
      }
    } catch (error) {
      console.error('Failed to toggle project visibility:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        updateProjects,
        addProject,
        updateProject,
        deleteProject,
        resetProjects,
        migrateToDatabase,
        reloadProjects, // Voeg de nieuwe functie toe
        toggleProjectVisibility, // Voeg de nieuwe functie toe
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}; 