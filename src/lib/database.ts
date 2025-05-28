import { supabase, STORAGE_BUCKET, getPublicUrl } from './supabase';
import { Project, projects as initialProjects } from '@/data/projects';
import { v4 as uuidv4 } from 'uuid';

// Database tabel namen
const PROJECTS_TABLE = 'projects';
const HOME_CONTENT_TABLE = 'home_content';
const CONTACT_MESSAGES_TABLE = 'contact_messages';
const CONTACT_INFO_TABLE = 'contact_info';

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
  // console.log(`Converted ID '${id}' to UUID: ${generatedUuid}`);
  return generatedUuid;
}

// CRUD operaties voor projecten
export const projectsService = {
  // Haal alle projecten op
  async getProjects(): Promise<{ data: Project[] | null; error: any }> {
    try {
      // console.log('Getting projects from database');
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        // console.error('Supabase error getting projects:', error);
        return { data: null, error };
      }
      
      // Log de ruwe data voor debugging
      // console.log('Raw project data from database:', data);
      
      // Verwerk de data zodat het compatible is met frontend verwachtingen
      if (data) {
        try {
          // console.log(`Processing ${data.length} projects`);
          
          // Zorg ervoor dat alle data in het juiste formaat is
          const processedData = data.map(projectData => {
            // Maak een kopie van de projectdata om te verwerken
            const project = { ...projectData };
            
            // Zorg ervoor dat categories een array is
            if (typeof project.categories === 'string') {
              try {
                project.categories = JSON.parse(project.categories);
              } catch (error) {
                // console.error(`Error parsing categories for project ${project.id}:`, error);
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
                  // console.error(`Error parsing technologies for project ${project.id}:`, error);
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
                  // console.error(`Error parsing skills for project ${project.id}:`, error);
                  project.skills = [project.skills];
                }
              } else if (!Array.isArray(project.skills)) {
                project.skills = [project.skills];
              }
            }

            // Zorg ervoor dat content als array wordt geparsed uit jsonb
            if (project.content && !Array.isArray(project.content)) {
              try {
                // Als het een string is, parse het als JSON
                if (typeof project.content === 'string') {
                  const parsedContent = JSON.parse(project.content);
                  if (Array.isArray(parsedContent)) {
                    project.content = parsedContent as Project['content'];
                    // console.log(`Successfully parsed content for project ${project.id}`);
                  } else {
                    // console.warn(`Project ${project.id} parsed content is not an array:`, parsedContent);
                    project.content = [];
                  }
                } else {
                  // console.warn(`Project ${project.id} content is not an array or string:`, project.content);
                  // Fallback om altijd een array te hebben
                  project.content = [];
                }
              } catch (error) {
                // console.error(`Error parsing content for project ${project.id}:`, error);
                // Fallback naar lege array bij parse fouten
                project.content = [];
              }
            }
            
            return project;
          });
          
          return { data: processedData, error: null };
        } catch (error) {
          // console.error('Error processing project data:', error);
          return { data: null, error };
        }
      }
      
      return { data: [], error: null };
    } catch (error) {
      // console.error('Unexpected error in getProjects:', error);
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
        // Gebruik een type assertion om TypeScript te laten weten dat we bewust een string toewijzen
        // voor database opslag doeleinden
        (formattedProject as any).content = JSON.stringify(formattedProject.content);
      }
      
      // console.log('Formatted project for storage:', formattedProject);
      return formattedProject;
    } catch (error) {
      // console.error('Error formatting project for storage:', error);
      throw error;
    }
  },

  // Haal een enkel project op basis van ID
  async getProjectById(id: string): Promise<{ data: Project | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        return { data: null, error };
      }
      
      if (data) {
        // Parse the content field if it's a string
        if (data.content && !Array.isArray(data.content)) {
          try {
            if (typeof data.content === 'string') {
              const parsedContent = JSON.parse(data.content);
              if (Array.isArray(parsedContent)) {
                data.content = parsedContent as Project['content'];
                // console.log(`Successfully parsed content for individual project ${id}`);
              } else {
                // console.warn(`Project ${id} parsed content is not an array:`, parsedContent);
                data.content = [];
              }
            }
          } catch (error) {
            // console.error(`Error parsing content for individual project ${id}:`, error);
            data.content = [];
          }
        }
        
        // Handle other fields like categories, technologies, skills
        // similar to getProjects() if needed
      }
      
      return { data, error };
    } catch (error) {
      // console.error('Error in getProjectById:', error);
      return { data: null, error };
    }
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
      // console.error('Error in addProject:', error);
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
      // console.error('Error in updateProject:', error);
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
        // console.log('No local projects found for migration');
        return { success: true, error: null };
      }
      
      const projects = JSON.parse(localProjects);
      
      if (!Array.isArray(projects) || projects.length === 0) {
        // console.log('No valid projects in localStorage for migration');
        return { success: true, error: null };
      }
      
      // console.log(`Found ${projects.length} projects in localStorage for migration`);
      
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
        // console.log('All projects already exist in database, nothing to migrate');
        return { success: true, error: null };
      }
      
      // console.log(`Migrating ${newProjects.length} new projects to Supabase`);
      
      // Voeg nieuwe projecten toe aan Supabase
      const { error } = await supabase
        .from(PROJECTS_TABLE)
        .insert(newProjects);
      
      if (error) {
        // console.error('Error migrating projects to Supabase:', error);
        return { success: false, error };
      }
      
      // console.log('Successfully migrated projects from localStorage to Supabase');
      return { success: true, error: null };
    } catch (error) {
      // console.error('Error during project migration:', error);
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
            // console.error(`Error updating project ${project.id}:`, updateError);
          }
        } catch (error) {
          // console.error(`Error correcting project ${project.id}:`, error);
        }
      }
      
      return { success: true, error: null };
    } catch (error) {
      // console.error('Error during data correction:', error);
      return { success: false, error };
    }
  },

  // Reset de database indien nodig met de initiële projectdata
  async repairDatabaseWithInitialData(): Promise<{ success: boolean; error: any }> {
    // console.log('Attempting to repair database with initial projects');
    
    try {
      // Controleer eerst of er al projecten in de database staan
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select('id')
        .limit(1);
      
      if (error) {
        // console.error('Error checking existing projects:', error);
        return { success: false, error };
      }
      
      // Als er al projecten zijn, dan is reparatie niet nodig
      if (data && data.length > 0) {
        // console.log('Database already contains projects, no repair needed');
        return { success: true, error: null };
      }
      
      // console.log('No projects found in database, repairing with initial data');
      
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
        // console.error('Error inserting initial projects during repair:', insertError);
        return { success: false, error: insertError };
      }
      
      // console.log('Database repair successful, added initial projects');
      return { success: true, error: null };
    } catch (error) {
      // console.error('Unexpected error during database repair:', error);
      return { success: false, error };
    }
  },

  // Reset de projecten in de database met de gegeven initiële data
  async resetWithInitialData(initialData: Project[]): Promise<{ success: boolean; error: any }> {
    // console.log('Resetting database with provided projects');
    
    try {
      // Verwijder eerst alle bestaande projecten
      const { error: deleteError } = await supabase
        .from(PROJECTS_TABLE)
        .delete()
        .neq('id', 'dummy'); // Delete alle rijen
      
      if (deleteError) {
        // console.error('Error deleting existing projects:', deleteError);
        return { success: false, error: deleteError };
      }
      
      // Als er geen projecten zijn om toe te voegen, zijn we klaar
      if (!initialData || initialData.length === 0) {
        // console.log('No projects to add, reset completed');
        return { success: true, error: null };
      }
      
      // Bereid de projecten voor voor opslag
      const formattedProjects = initialData.map(project => {
        // Zorg ervoor dat alle vereiste velden aanwezig zijn
        const formattedProject = this.formatProjectForStorage({
          ...project,
          id: convertToValidUuid(project.id)
        });
        
        return formattedProject;
      });
      
      // Voeg de nieuwe projecten toe
      const { error: insertError } = await supabase
        .from(PROJECTS_TABLE)
        .insert(formattedProjects);
      
      if (insertError) {
        // console.error('Error inserting projects during reset:', insertError);
        return { success: false, error: insertError };
      }
      
      // console.log('Database reset successful with', formattedProjects.length, 'projects');
      return { success: true, error: null };
    } catch (error) {
      // console.error('Unexpected error during database reset:', error);
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
        // console.log(`Creating storage bucket: ${STORAGE_BUCKET}`);
        await supabase.storage.createBucket(STORAGE_BUCKET, {
          public: true // Ensures files are publicly accessible
        });
      }
      
      // List all files in the media bucket
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list();
      
      if (error) {
        // console.error('Error fetching media items from Supabase:', error);
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
      // console.error('Unexpected error in getMediaItems:', error);
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
      // console.error('Error loading media items from localStorage:', error);
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
        // console.error('Error uploading file to Supabase:', error);
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
      // console.error('Unexpected error in uploadFile:', error);
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
          // console.error('Error adding to media library:', error);
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
      // console.error('Error deleting file:', error);
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
          // console.error(`Error migrating media item ${item.name}:`, error);
        }
      }
      
      return { success: true, error: null };
    } catch (error) {
      // console.error('Error during media migration:', error);
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
      case 'mp4':
        return 'video/mp4';
      case 'webm':
        return 'video/webm';
      case 'ogg':
        return 'video/ogg';
      case 'mov':
        return 'video/quicktime';
      case 'avi':
        return 'video/x-msvideo';
      case 'wmv':
        return 'video/x-ms-wmv';
      default:
        return 'application/octet-stream';
    }
  }
};

// Home content service
export const homeContentService = {
  // Haal de home content op
  async getHomeContent(): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from(HOME_CONTENT_TABLE)
        .select('*')
        .single();
      
      if (error) {
        // console.error('Supabase error getting home content:', error);
        return { data: null, error };
      }
      
      // Verwerk de data zodat het compatible is met frontend verwachtingen
      if (data) {
        try {
          // Zorg ervoor dat arrays correct geparsed worden
          if (data.featuredProjects && typeof data.featuredProjects === 'string') {
            try {
              data.featuredProjects = JSON.parse(data.featuredProjects);
            } catch (e) {
              // console.error('Error parsing featuredProjects:', e);
              data.featuredProjects = [];
            }
          }
          
          if (data.skillsItems && typeof data.skillsItems === 'string') {
            try {
              data.skillsItems = JSON.parse(data.skillsItems);
            } catch (e) {
              // console.error('Error parsing skillsItems:', e);
              data.skillsItems = [];
            }
          }
          
          if (data.footerLinks && typeof data.footerLinks === 'string') {
            try {
              data.footerLinks = JSON.parse(data.footerLinks);
            } catch (e) {
              // console.error('Error parsing footerLinks:', e);
              data.footerLinks = [];
            }
          }
          
          // Zorg ervoor dat timelineItems correct geparsed wordt
          if (data.timelineItems && typeof data.timelineItems === 'string') {
            try {
              data.timelineItems = JSON.parse(data.timelineItems);
            } catch (e) {
              // console.error('Error parsing timelineItems:', e);
              data.timelineItems = [];
            }
          }
        } catch (error) {
          // console.error('Error processing home content data:', error);
          return { data: null, error };
        }
      }
      
      return { data, error: null };
    } catch (error) {
      // console.error('Unexpected error in getHomeContent:', error);
      return { data: null, error };
    }
  },

  // Update de home content
  async updateHomeContent(content: any): Promise<{ data: any; error: any }> {
    try {
      // console.log('START updateHomeContent - Received content:', content);
      
      // Bereid de data voor voor opslag in Supabase
      const formattedContent = { ...content };
      
      // Converteer arrays naar strings voor opslag
      if (Array.isArray(formattedContent.featuredProjects)) {
        // console.log('Converting featuredProjects array to string');
        formattedContent.featuredProjects = JSON.stringify(formattedContent.featuredProjects);
      }
      
      if (Array.isArray(formattedContent.skillsItems)) {
        // console.log('Converting skillsItems array to string');
        formattedContent.skillsItems = JSON.stringify(formattedContent.skillsItems);
      }
      
      if (Array.isArray(formattedContent.footerLinks)) {
        // console.log('Converting footerLinks array to string');
        formattedContent.footerLinks = JSON.stringify(formattedContent.footerLinks);
      }
      
      if (Array.isArray(formattedContent.timelineItems)) {
        // console.log('Converting timelineItems array to string');
        formattedContent.timelineItems = JSON.stringify(formattedContent.timelineItems);
      }
      
      // console.log('Formatted content ready for database:', formattedContent);
      
      // Controleer of de record al bestaat
      // console.log('Checking if home_content record already exists');
      const { data: existingData, error: checkError } = await supabase
        .from(HOME_CONTENT_TABLE)
        .select('id')
        .single();
      
      if (checkError) {
        // console.error('Error checking existing home_content:', checkError);
        if (checkError.code !== 'PGRST116') { // Not found error is expected if no record exists
          return { data: null, error: checkError };
        }
      }
      
      let result;
      
      if (existingData) {
        // Update bestaande record
        // console.log('Updating existing record with ID:', existingData.id);
        result = await supabase
          .from(HOME_CONTENT_TABLE)
          .update(formattedContent)
          .eq('id', existingData.id)
          .select();
      } else {
        // Maak nieuwe record aan
        // console.log('No existing record found, creating new record');
        result = await supabase
          .from(HOME_CONTENT_TABLE)
          .insert(formattedContent)
          .select();
      }
      
      // console.log('Database operation result:', result);
      
      if (result.error) {
        // console.error('Error in database operation:', result.error);
        // console.error('Error details:', JSON.stringify(result.error, null, 2));
      } else {
        // console.log('Home content successfully saved to database');
      }
      
      return result;
    } catch (error) {
      // console.error('Exception in updateHomeContent:', error);
      // console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return { data: null, error };
    }
  },

  // Migreer home content van localStorage naar Supabase
  async migrateFromLocalStorage(): Promise<{ success: boolean; error: any }> {
    try {
      // console.log('START migrateFromLocalStorage for home content');
      
      // Haal content op uit localStorage
      const STORAGE_KEY = 'portfolio_home_content';
      const storedContent = localStorage.getItem(STORAGE_KEY);
      
      if (!storedContent) {
        // console.log('No local home content found for migration');
        return { success: true, error: null };
      }
      
      // console.log('Raw stored content from localStorage:', storedContent);
      
      try {
        const homeContent = JSON.parse(storedContent);
        // console.log('Parsed home content:', homeContent);
        
        // Valideer de belangrijkste velden
        // console.log('Validating content structure:');
        // console.log('- featuredProjects:', Array.isArray(homeContent.featuredProjects) ? 'is array' : typeof homeContent.featuredProjects);
        // console.log('- skillsItems:', Array.isArray(homeContent.skillsItems) ? 'is array' : typeof homeContent.skillsItems);
        // console.log('- footerLinks:', Array.isArray(homeContent.footerLinks) ? 'is array' : typeof homeContent.footerLinks);
        
        // Update or insert home content
        // console.log('Calling updateHomeContent...');
        const { data, error } = await this.updateHomeContent(homeContent);
        
        if (error) {
          // console.error('Error from updateHomeContent:', error);
          // console.error('Error details:', JSON.stringify(error, null, 2));
          return { success: false, error };
        }
        
        // console.log('Successfully migrated home content from localStorage to Supabase:', data);
        return { success: true, error: null };
      } catch (parseError) {
        // console.error('Error parsing localStorage content:', parseError);
        return { success: false, error: parseError };
      }
    } catch (error) {
      // console.error('Unexpected error during home content migration:', error);
      // console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return { success: false, error };
    }
  },

  // Test database toegang om te zien of de RLS-policies werken
  async testDatabaseAccess(): Promise<{ success: boolean; error: any }> {
    try {
      // console.log('Testing database access for home_content table...');
      
      // Probeer eerst een SELECT query
      // console.log('Testing SELECT access...');
      const { data: selectData, error: selectError } = await supabase
        .from(HOME_CONTENT_TABLE)
        .select('id')
        .limit(1);
      
      if (selectError) {
        // console.error('SELECT access test failed:', selectError);
        // console.error('Error details:', JSON.stringify(selectError, null, 2));
        return { success: false, error: selectError };
      }
      
      // Test een dummy INSERT (we voeren deze niet echt uit, maar checken alleen de query plan)
      // console.log('Testing INSERT access...');
      const { error: insertError } = await supabase
        .from(HOME_CONTENT_TABLE)
        .insert({ heroTitle: 'Test Title' })
        .select();
      
      if (insertError) {
        // console.error('INSERT access test failed:', insertError);
        // console.error('Error details:', JSON.stringify(insertError, null, 2));
        // We retourneren nog steeds success omdat we alleen willen testen
      } else {
        // console.log('INSERT access test successful');
      }
      
      return { success: true, error: null };
    } catch (error) {
      // console.error('Unexpected error during database access test:', error);
      // console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return { success: false, error };
    }
  }
};

// Contact messages service
export const contactService = {
  // Haal alle berichten op
  async getMessages(): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from(CONTACT_MESSAGES_TABLE)
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        // console.error('Supabase error getting contact messages:', error);
        return { data: [], error };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      // console.error('Unexpected error in getMessages:', error);
      return { data: [], error };
    }
  },

  // Voeg een nieuw bericht toe
  async addMessage(message: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from(CONTACT_MESSAGES_TABLE)
        .insert(message)
        .select();
      
      return { data, error };
    } catch (error) {
      // console.error('Error in addMessage:', error);
      return { data: null, error };
    }
  },

  // Markeer een bericht als gelezen
  async markAsRead(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from(CONTACT_MESSAGES_TABLE)
        .update({ isRead: true })
        .eq('id', id);
      
      return { error };
    } catch (error) {
      // console.error('Error in markAsRead:', error);
      return { error };
    }
  },

  // Verwijder een bericht
  async deleteMessage(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from(CONTACT_MESSAGES_TABLE)
        .delete()
        .eq('id', id);
      
      return { error };
    } catch (error) {
      // console.error('Error in deleteMessage:', error);
      return { error };
    }
  },

  // Migreer berichten van localStorage naar Supabase
  async migrateFromLocalStorage(): Promise<{ success: boolean; error: any }> {
    try {
      // console.log('START migrateFromLocalStorage for contact messages');
      
      // Haal berichten op uit localStorage
      const STORAGE_KEY = 'portfolio_contact_messages';
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      
      if (!storedMessages) {
        // console.log('No local contact messages found for migration');
        return { success: true, error: null };
      }
      
      // console.log('Raw stored messages from localStorage:', storedMessages);
      
      try {
        const messages = JSON.parse(storedMessages);
        // console.log('Parsed messages:', messages);
        
        if (!Array.isArray(messages) || messages.length === 0) {
          // console.log('No valid contact messages in localStorage for migration');
          return { success: true, error: null };
        }
        
        // console.log(`Found ${messages.length} contact messages in localStorage for migration`);
        
        // Voeg alle berichten toe aan Supabase
        // console.log('Inserting messages into database...');
        const { data, error } = await supabase
          .from(CONTACT_MESSAGES_TABLE)
          .insert(messages)
          .select();
        
        if (error) {
          // console.error('Error migrating contact messages to Supabase:', error);
          // console.error('Error details:', JSON.stringify(error, null, 2));
          return { success: false, error };
        }
        
        // console.log('Successfully migrated contact messages from localStorage to Supabase:', data);
        return { success: true, error: null };
      } catch (parseError) {
        // console.error('Error parsing localStorage messages:', parseError);
        return { success: false, error: parseError };
      }
    } catch (error) {
      // console.error('Unexpected error during contact messages migration:', error);
      // console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return { success: false, error };
    }
  }
};

// Contact info service voor beheer van contactgegevens en social links
export const contactInfoService = {
  // Standaard contactinformatie als deze nog niet in de database bestaat
  defaultContactInfo: {
    email: "jorian.bracke@example.com",
    phone: "+31 6 12345678",
    location: "Amsterdam, Nederland",
    socialLinks: [
      { id: "1", platform: "GitHub", url: "https://github.com", icon: "github" },
      { id: "2", platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { id: "3", platform: "Twitter", url: "https://twitter.com", icon: "twitter" }
    ]
  },

  // Haal contactinformatie op
  async getContactInfo(): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from(CONTACT_INFO_TABLE)
        .select('*')
        .single();
      
      if (error) {
        // Als er geen data is, gebruik de standaard info
        if (error.code === 'PGRST116') { // Not found error
          return { data: this.defaultContactInfo, error: null };
        }
        
        return { data: null, error };
      }
      
      // Verwerk de data zodat het compatible is met frontend verwachtingen
      if (data) {
        try {
          // Zorg ervoor dat social links correct geparsed worden
          if (data.socialLinks && typeof data.socialLinks === 'string') {
            try {
              data.socialLinks = JSON.parse(data.socialLinks);
            } catch (e) {
              data.socialLinks = [];
            }
          }
        } catch (error) {
          return { data: null, error };
        }
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update contactinformatie
  async updateContactInfo(contactInfo: any): Promise<{ data: any; error: any }> {
    try {
      // Bereid de data voor voor opslag in Supabase
      const formattedContactInfo = { ...contactInfo };
      
      // Converteer arrays naar strings voor opslag
      if (Array.isArray(formattedContactInfo.socialLinks)) {
        formattedContactInfo.socialLinks = JSON.stringify(formattedContactInfo.socialLinks);
      }
      
      // Controleer of de record al bestaat
      const { data: existingData, error: checkError } = await supabase
        .from(CONTACT_INFO_TABLE)
        .select('id')
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found error is expected if no record exists
        return { data: null, error: checkError };
      }
      
      let result;
      
      if (existingData) {
        // Update bestaande record
        result = await supabase
          .from(CONTACT_INFO_TABLE)
          .update(formattedContactInfo)
          .eq('id', existingData.id)
          .select();
      } else {
        // Maak nieuwe record aan
        result = await supabase
          .from(CONTACT_INFO_TABLE)
          .insert(formattedContactInfo)
          .select();
      }
      
      return result;
    } catch (error) {
      return { data: null, error };
    }
  },

  // Migreer contactinformatie van lokale opslag (indien nodig)
  async migrateFromLocalStorage(): Promise<{ success: boolean; error: any }> {
    try {
      console.log('START migrateFromLocalStorage for contact info');
      
      // Controleer of er al contactinfo in de database staat
      const { data: existingData, error: checkError } = await supabase
        .from(CONTACT_INFO_TABLE)
        .select('id')
        .single();
      
      // Als er al data is, stop dan (om te voorkomen dat we bestaande info overschrijven)
      if (!checkError) {
        console.log('Contact info already exists in database, no migration needed');
        return { success: true, error: null };
      }
      
      // Gebruik de standaard contactinfo als basis
      const contactInfo = this.defaultContactInfo;
      
      // Bereid de data voor voor opslag in Supabase
      const formattedContactInfo = { ...contactInfo };
      
      // Converteer arrays naar strings voor opslag
      if (Array.isArray(formattedContactInfo.socialLinks)) {
        formattedContactInfo.socialLinks = JSON.stringify(formattedContactInfo.socialLinks);
      }
      
      // Voeg toe aan de database
      console.log('Inserting default contact info into database');
      const { data, error } = await supabase
        .from(CONTACT_INFO_TABLE)
        .insert(formattedContactInfo)
        .select();
      
      if (error) {
        console.error('Error migrating contact info to Supabase:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return { success: false, error };
      }
      
      console.log('Successfully migrated contact info to Supabase:', data);
      return { success: true, error: null };
    } catch (error) {
      console.error('Unexpected error during contact info migration:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return { success: false, error };
    }
  }
}; 