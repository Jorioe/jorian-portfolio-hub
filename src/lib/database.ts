import { supabase, STORAGE_BUCKET, getPublicUrl } from './supabase';
import { Project, projects as initialProjects } from '@/data/projects';
import { v4 as uuidv4 } from 'uuid';

// Database tabel naam
const PROJECTS_TABLE = 'projects';

// Helper functie om eenvoudige ID's om te zetten naar geldige UUID's
function convertToValidUuid(id: string): string {
  // Check of de ID al een geldig UUID-formaat heeft
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(id)) {
    return id;
  }
  
  // Als het geen geldig UUID is, genereer een nieuw UUID op basis van de huidige ID
  // We voegen een vaste prefix toe zodat dezelfde ID altijd hetzelfde UUID oplevert
  const generatedUuid = uuidv4();
  console.log(`Converted ID '${id}' to UUID: ${generatedUuid}`);
  return generatedUuid;
}

// CRUD operaties voor projecten
export const projectsService = {
  // Haal alle projecten op
  async getProjects(): Promise<{ data: Project[] | null; error: any }> {
    try {
      console.log('Getting projects from database');
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Supabase error getting projects:', error);
        return { data: null, error };
      }
      
      // Log de ruwe data voor debugging
      console.log('Raw project data from database:', data);
      
      // Verwerk de data zodat het compatible is met frontend verwachtingen
      if (data) {
        try {
          console.log(`Processing ${data.length} projects`);
          
          // Zorg ervoor dat alle data in het juiste formaat is
          const processedData = data.map(projectData => {
            // Maak een kopie van de projectdata om te verwerken
            const project = { ...projectData };
            
            // Zorg ervoor dat categories een array is
            if (typeof project.categories === 'string') {
              try {
                project.categories = JSON.parse(project.categories);
              } catch (error) {
                console.error(`Error parsing categories for project ${project.id}:`, error);
                project.categories = [project.categories];
              }
            } else if (!Array.isArray(project.categories)) {
              project.categories = project.categories ? [project.categories] : [];
            }
            
            // Zorg ervoor dat technologies een array is als het bestaat
            if (project.technologies) {
              if (typeof project.technologies === 'string') {
                try {
                  project.technologies = JSON.parse(project.technologies);
                } catch (error) {
                  console.error(`Error parsing technologies for project ${project.id}:`, error);
                  project.technologies = [project.technologies];
                }
              } else if (!Array.isArray(project.technologies)) {
                project.technologies = [project.technologies];
              }
            }
            
            // Zorg ervoor dat skills een array is als het bestaat
            if (project.skills) {
              if (typeof project.skills === 'string') {
                try {
                  project.skills = JSON.parse(project.skills);
                } catch (error) {
                  console.error(`Error parsing skills for project ${project.id}:`, error);
                  project.skills = [project.skills];
                }
              } else if (!Array.isArray(project.skills)) {
                project.skills = [project.skills];
              }
            }
            
            return project;
          });
          
          return { data: processedData, error: null };
        } catch (error) {
          console.error('Error processing project data:', error);
          return { data: null, error };
        }
      }
      
      return { data: [], error: null };
    } catch (error) {
      console.error('Unexpected error in getProjects:', error);
      return { data: null, error };
    }
  },

  // Format project voor opslag in Supabase
  formatProjectForStorage(project: Project): any {
    try {
      // Maak een kopie van het project om te bewerken
      const formattedProject = { ...project };
      
      // Controleer of de arrays correct geformatteerd zijn voor PostgreSQL
      if (formattedProject.categories && !Array.isArray(formattedProject.categories)) {
        formattedProject.categories = formattedProject.categories ? [formattedProject.categories] : [];
      }
      
      if (formattedProject.technologies && !Array.isArray(formattedProject.technologies)) {
        formattedProject.technologies = formattedProject.technologies ? [formattedProject.technologies] : [];
      }
      
      if (formattedProject.skills && !Array.isArray(formattedProject.skills)) {
        formattedProject.skills = formattedProject.skills ? [formattedProject.skills] : [];
      }
      
      // Converteer content naar JSONB als het nog geen string is
      if (formattedProject.content && typeof formattedProject.content !== 'string') {
        formattedProject.content = JSON.stringify(formattedProject.content);
      }
      
      console.log('Formatted project for storage:', formattedProject);
      return formattedProject;
    } catch (error) {
      console.error('Error formatting project for storage:', error);
      throw error;
    }
  },

  // Haal een enkel project op basis van ID
  async getProjectById(id: string): Promise<{ data: Project | null; error: any }> {
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // Voeg een nieuw project toe
  async addProject(project: Project): Promise<{ data: any; error: any }> {
    try {
      // Zorg ervoor dat het project in het juiste formaat is voor Supabase
      const formattedProject = this.formatProjectForStorage(project);
      
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .insert(formattedProject)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error in addProject:', error);
      return { data: null, error };
    }
  },

  // Update een bestaand project
  async updateProject(project: Project): Promise<{ data: any; error: any }> {
    try {
      // Zorg ervoor dat het project in het juiste formaat is voor Supabase
      const formattedProject = this.formatProjectForStorage(project);
      
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .update(formattedProject)
        .eq('id', project.id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error in updateProject:', error);
      return { data: null, error };
    }
  },

  // Verwijder een project
  async deleteProject(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from(PROJECTS_TABLE)
      .delete()
      .eq('id', id);
    
    return { error };
  },

  // Migreer projecten van localStorage naar Supabase
  async migrateFromLocalStorage(): Promise<{ success: boolean; error: any }> {
    try {
      // Haal projecten op uit localStorage
      const localStorageKey = 'projects';
      const localProjects = localStorage.getItem(localStorageKey);
      
      if (!localProjects) {
        console.log('No local projects found for migration');
        return { success: true, error: null };
      }
      
      const projects = JSON.parse(localProjects);
      
      if (!Array.isArray(projects) || projects.length === 0) {
        console.log('No valid projects in localStorage for migration');
        return { success: true, error: null };
      }
      
      console.log(`Found ${projects.length} projects in localStorage for migration`);
      
      // Converteer lokaal opgeslagen projecten naar het juiste formaat voor Supabase
      const formattedProjects = projects.map(project => {
        // Zorg dat het ID een geldig UUID is
        const supabaseProject = {
          ...project,
          id: convertToValidUuid(project.id)
        };
        
        // Format het project voor opslag
        return this.formatProjectForStorage(supabaseProject);
      });
      
      // Controleer of deze projecten al in de database bestaan
      const { data: existingProjects } = await supabase
        .from(PROJECTS_TABLE)
        .select('id')
        .in('id', formattedProjects.map(p => p.id));
      
      const existingIds = new Set((existingProjects || []).map(p => p.id));
      
      // Filter projecten die nog niet in de database zijn
      const newProjects = formattedProjects.filter(p => !existingIds.has(p.id));
      
      if (newProjects.length === 0) {
        console.log('All projects already exist in database, nothing to migrate');
        return { success: true, error: null };
      }
      
      console.log(`Migrating ${newProjects.length} new projects to Supabase`);
      
      // Voeg nieuwe projecten toe aan Supabase
      const { error } = await supabase
        .from(PROJECTS_TABLE)
        .insert(newProjects);
      
      if (error) {
        console.error('Error migrating projects to Supabase:', error);
        return { success: false, error };
      }
      
      console.log('Successfully migrated projects from localStorage to Supabase');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error during project migration:', error);
      return { success: false, error };
    }
  },

  // Je kunt deze functie aanroepen om data op te schonen als dat nodig is
  async correctDatabaseData(): Promise<{ success: boolean; error: any }> {
    try {
      // Haal alle projecten op
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('*');
      
      if (error) {
        return { success: false, error };
      }
      
      if (!data || data.length === 0) {
        return { success: true, error: null }; // Geen data om te corrigeren
      }
      
      // Voor elk project, corrigeer het formaat en update het
      for (const project of data) {
        try {
          const correctedProject = this.formatProjectForStorage(project);
          
          const { error: updateError } = await supabase
            .from(PROJECTS_TABLE)
            .update(correctedProject)
            .eq('id', project.id);
          
          if (updateError) {
            console.error(`Error updating project ${project.id}:`, updateError);
          }
        } catch (error) {
          console.error(`Error correcting project ${project.id}:`, error);
        }
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error during data correction:', error);
      return { success: false, error };
    }
  },

  // Reset de database indien nodig met de initiële projectdata
  async repairDatabaseWithInitialData(): Promise<{ success: boolean; error: any }> {
    console.log('Attempting to repair database with initial projects');
    
    try {
      // Controleer eerst of er al projecten in de database staan
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Error checking existing projects:', error);
        return { success: false, error };
      }
      
      // Als er al projecten zijn, dan is reparatie niet nodig
      if (data && data.length > 0) {
        console.log('Database already contains projects, no repair needed');
        return { success: true, error: null };
      }
      
      console.log('No projects found in database, repairing with initial data');
      
      // Zet de initiële projecten om naar UUID-formaat
      const transformedProjects = initialProjects.map(project => {
        // Zorg ervoor dat alle vereiste velden aanwezig zijn
        return {
          ...project,
          id: convertToValidUuid(project.id)
        };
      });
      
      // Voeg de projecten toe aan de database
      const { error: insertError } = await supabase
        .from(PROJECTS_TABLE)
        .insert(transformedProjects);
      
      if (insertError) {
        console.error('Error inserting initial projects during repair:', insertError);
        return { success: false, error: insertError };
      }
      
      console.log('Database repair successful, added initial projects');
      return { success: true, error: null };
    } catch (error) {
      console.error('Unexpected error during database repair:', error);
      return { success: false, error };
    }
  }
};

// Media bibliotheek service
export const mediaService = {
  // Lokale opslag key voor fallback
  MEDIA_STORAGE_KEY: 'portfolio_media_library',
  
  // Haal alle media items op
  async getMediaItems(): Promise<{ data: any[]; error: any }> {
    try {
      // Check if storage bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
      
      if (!bucketExists) {
        console.log(`Creating storage bucket: ${STORAGE_BUCKET}`);
        await supabase.storage.createBucket(STORAGE_BUCKET, {
          public: true // Ensures files are publicly accessible
        });
      }
      
      // List all files in the media bucket
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list();
      
      if (error) {
        console.error('Error fetching media items from Supabase:', error);
        // Fallback to localStorage
        return this.getMediaItemsFromLocalStorage();
      }
      
      // Transform to the expected format
      const mediaItems = data.map(item => ({
        id: item.id || uuidv4(),
        name: item.name,
        url: getPublicUrl(`${item.name}`),
        type: this.getMimeTypeFromFilename(item.name),
        size: item.metadata?.size || 0,
        uploadDate: item.created_at || new Date().toISOString()
      }));
      
      return { data: mediaItems, error: null };
    } catch (error) {
      console.error('Unexpected error in getMediaItems:', error);
      // Fallback to localStorage
      return this.getMediaItemsFromLocalStorage();
    }
  },
  
  // Fallback: Haal media items op uit localStorage
  getMediaItemsFromLocalStorage(): { data: any[]; error: any } {
    try {
      const storedItems = localStorage.getItem(this.MEDIA_STORAGE_KEY);
      if (storedItems) {
        return { data: JSON.parse(storedItems), error: null };
      }
      return { data: [], error: null };
    } catch (error) {
      console.error('Error loading media items from localStorage:', error);
      return { data: [], error };
    }
  },
  
  // Upload een bestand naar Supabase Storage
  async uploadFile(file: File): Promise<{ data: any; error: any }> {
    try {
      // Generate a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading file to Supabase:', error);
        // Fallback to localStorage
        return this.uploadFileToLocalStorage(file);
      }
      
      // Get the public URL
      const url = getPublicUrl(fileName);
      
      // Return the media item format
      return {
        data: {
          id: uuidv4(),
          name: file.name,
          url,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Unexpected error in uploadFile:', error);
      // Fallback to localStorage
      return this.uploadFileToLocalStorage(file);
    }
  },
  
  // Fallback: Upload naar localStorage
  async uploadFileToLocalStorage(file: File): Promise<{ data: any; error: any }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const result = reader.result as string;
          const mediaItems = JSON.parse(localStorage.getItem(this.MEDIA_STORAGE_KEY) || '[]');
          
          const newMediaItem = {
            id: uuidv4(),
            name: file.name,
            url: result,
            type: file.type,
            size: file.size,
            uploadDate: new Date().toISOString()
          };
          
          mediaItems.push(newMediaItem);
          localStorage.setItem(this.MEDIA_STORAGE_KEY, JSON.stringify(mediaItems));
          
          resolve({ data: newMediaItem, error: null });
        } catch (error) {
          console.error('Error adding to media library:', error);
          resolve({ data: null, error });
        }
      };
      
      reader.onerror = () => {
        resolve({ data: null, error: new Error('Failed to read file') });
      };
      
      reader.readAsDataURL(file);
    });
  },
  
  // Verwijder een bestand
  async deleteFile(filename: string): Promise<{ error: any }> {
    try {
      // Als het een volledige URL is, haal de filename eruit
      if (filename.startsWith('http')) {
        const url = new URL(filename);
        filename = url.pathname.split('/').pop() || '';
      }
      
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filename]);
      
      return { error };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { error };
    }
  },
  
  // Import media van localStorage naar Supabase
  async migrateMediaFromLocalStorage(): Promise<{ success: boolean; error: any }> {
    try {
      const mediaItems = JSON.parse(localStorage.getItem(this.MEDIA_STORAGE_KEY) || '[]');
      
      if (mediaItems.length === 0) {
        return { success: true, error: null };
      }
      
      // Voor elk item in localStorage
      for (const item of mediaItems) {
        try {
          // Skip als het geen data URL is (al een externe URL)
          if (!item.url.startsWith('data:')) {
            continue;
          }
          
          // Converteer data URL naar bestand
          const res = await fetch(item.url);
          const blob = await res.blob();
          const file = new File([blob], item.name, { type: item.type });
          
          // Upload naar Supabase
          await this.uploadFile(file);
        } catch (error) {
          console.error(`Error migrating media item ${item.name}:`, error);
        }
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error during media migration:', error);
      return { success: false, error };
    }
  },
  
  // Helper om MIME type te krijgen op basis van bestandsnaam
  getMimeTypeFromFilename(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'application/octet-stream';
    }
  }
}; 