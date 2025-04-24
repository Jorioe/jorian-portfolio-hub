import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, projects as initialProjects } from '@/data/projects';

// Definieer het type voor de context
interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  updateProjects: (newProjects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
}

// Lokale opslag key
const STORAGE_KEY = 'portfolio_projects';

// Creëer de context met een default waarde
const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  loading: true,
  updateProjects: () => {},
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
});

// Hook om de context te gebruiken
export const useProjects = () => useContext(ProjectContext);

// Helper om projecten op te halen uit lokale opslag
const getStoredProjects = (): Project[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
  }
  return initialProjects;
};

// Helper om projecten op te slaan in lokale opslag
const storeProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error storing projects in localStorage:', error);
  }
};

// Provider component
export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Laad projecten bij initialisatie
  useEffect(() => {
    try {
      const loadedProjects = getStoredProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Failed to load projects, using initial data:', error);
      setProjects(initialProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  // Functie om de volledige projectenlijst bij te werken
  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    storeProjects(newProjects);
    console.log('Projecten bijgewerkt:', newProjects);
  };

  // Functie om een enkel project toe te voegen
  const addProject = (project: Project) => {
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    storeProjects(updatedProjects);
    console.log('Project toegevoegd:', project);
  };

  // Functie om een enkel project bij te werken
  const updateProject = (project: Project) => {
    const updatedProjects = projects.map(p => p.id === project.id ? project : p);
    setProjects(updatedProjects);
    storeProjects(updatedProjects);
    console.log('Project bijgewerkt:', project);
  };

  // Functie om een project te verwijderen
  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    storeProjects(updatedProjects);
    console.log('Project verwijderd:', id);
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      loading, 
      updateProjects, 
      addProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
}; 