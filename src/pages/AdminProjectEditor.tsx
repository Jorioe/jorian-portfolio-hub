import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Project, CategoryType, projects } from '@/data/projects';
import { useProjects } from '@/lib/ProjectContext';
import { Trash2, Plus, Save, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ImageUploader } from '@/components/ImageUploader';
import React from 'react';

// Extend het ToastVariant type
type ToastVariant = 'default' | 'destructive' | 'warning';

// De skills uit CategoryBadge importeren
const skillCategories = {
  development: ["HTML", "CSS", "Javascript", "React", "Tailwind CSS", "Git", "Development"],
  design: ["Figma", "Adobe XD", "Prototyping", "Photoshop", "Illustrator", "UI/UX", "Design"],	 
  research: ["Google Analytics", "Survey Monkey", "User Testing", "A/B Testing", "Market Research", "Competitor Analysis"],
  data: ["Data Analysis", "Data Visualization", "SQL", "Python", "R", "Machine Learning", "Data"],
  rest: ["Event planning", "Social Media", "Marketing", "Content Creation", "SEO", "Email Marketing", "Rest"],
};

// Alle beschikbare skills samenvoegen
const allSkills = Object.values(skillCategories).flat();

// Functie om de categorie van een skill te vinden
const findCategoryForSkill = (skill: string): CategoryType | null => {
  const entry = Object.entries(skillCategories).find(([_, skills]) => 
    skills.includes(skill)
  );
  return entry ? entry[0] as CategoryType : null;
};

// Definieer een aangepast type voor content blokken in de admin interface
type ContentBlockType = 'text' | 'break' | 'subtitle' | 'small-subtitle' | 'quote-top' | 'quote' | 'quote-bottom' | 'image' | 'flex-text' | 'opsom-text' | 'opsom-text-top' | 'opsom-text-bottom' | 'boldtext' | 'boldtexttop' | 'bold-small-subtitle';

// Afbeeldingsformaatopties
type ImageSizeType = 'small' | 'medium' | 'large' | 'full';
type ImagePositionType = 'left' | 'right' | 'center';

// Interface voor een content block met een uitgebreider type
interface AdminContentBlock {
  type: ContentBlockType;
  content: string;
  content2?: string;
  imageSize?: ImageSizeType;
  imagePosition?: ImagePositionType;
  aditionalContent?: string; // Voor extra content zoals gebruikt bij boldtext
  imgtext?: string; // Voor begeleidende tekst bij afbeeldingen
  imgtext2?: string; // Voor begeleidende tekst bij tweede afbeelding
}

// Extended project interface voor admin gebruik
interface AdminProject extends Omit<Project, 'content'> {
  content: AdminContentBlock[];
  activeSkillTab?: string;
}

export default function AdminProjectEditor({ specialProjectId }: { specialProjectId?: string } = {}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, addProject, updateProject } = useProjects();
  
  // Gebruik de specialProjectId als die is meegegeven, anders gebruik de URL parameter
  const effectiveId = specialProjectId || id;
  
  // Veilig decoderen van de id parameter
  const safeId = React.useMemo(() => {
    try {
      // Als een specialProjectId is meegegeven, gebruik die direct
      if (specialProjectId) return specialProjectId;
      
      return effectiveId ? decodeURIComponent(effectiveId) : 'new';
    } catch (error) {
      console.error('Error decoding URI:', error);
      // Toon een foutmelding aan de gebruiker
      toast({
        variant: 'destructive',
        title: 'Fout bij laden',
        description: 'Er is een probleem opgetreden bij het laden van het project. Probeer het opnieuw.'
      });
      // Na een korte vertraging terugnavigeren
      setTimeout(() => navigate('/dashboard'), 1500);
      return 'error';
    }
  }, [effectiveId, specialProjectId, navigate, toast]);
  
  const isNewProject = safeId === 'new';
  
  const emptyProject: AdminProject = {
    id: '',
    title: '',
    description: '',
    image: '',
    categories: [],
    date: new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long' }),
    content: [
      { type: 'text', content: 'Nieuwe projectinhoud...' }
    ],
    activeSkillTab: 'development' // Standaard actieve tab
  };

  const [project, setProject] = useState<AdminProject>(emptyProject);
  const [isLoading, setIsLoading] = useState(false);
  
  const categoryOptions: { label: string; value: CategoryType }[] = [
    { label: "Ontwikkeling", value: "development" },
    { label: "Ontwerp", value: "design" },
    { label: "Onderzoek", value: "research" },
    { label: "Data", value: "data" },
    { label: "Overig", value: "rest" },
  ];

  const contentTypeOptions: { label: string; value: ContentBlockType }[] = [
    { label: "Tekst", value: "text" },
    { label: "Subtitel", value: "subtitle" },
    { label: "Kleine subtitel", value: "small-subtitle" },
    { label: "Vette kleine subtitel", value: "bold-small-subtitle" },
    { label: "Witregel", value: "break" },
    { label: "Citaat", value: "quote" },
    { label: "Citaat (boven)", value: "quote-top" },
    { label: "Citaat (onder)", value: "quote-bottom" },
    { label: "Afbeelding", value: "image" },
    { label: "Flexibele tekst", value: "flex-text" },
    { label: "Opsommingstekst", value: "opsom-text" },
    { label: "Opsommingstekst (boven)", value: "opsom-text-top" },
    { label: "Opsommingstekst (onder)", value: "opsom-text-bottom" },
    { label: "Vette tekst", value: "boldtext" },
    { label: "Vette tekst (boven)", value: "boldtexttop" },
  ];

  const imageSizeOptions: { label: string; value: ImageSizeType }[] = [
    { label: "Klein", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Groot", value: "large" },
    { label: "Volledig", value: "full" },
  ];

  const imagePositionOptions: { label: string; value: ImagePositionType }[] = [
    { label: "Links", value: "left" },
    { label: "Rechts", value: "right" },
    { label: "Gecentreerd", value: "center" },
  ];

  // Organiseer vaardigheden per categorie voor weergave
  const skillsByCategory = useMemo(() => {
    return Object.entries(skillCategories).map(([category, skills]) => ({
      category: category as CategoryType,
      categoryLabel: categoryOptions.find(opt => opt.value === category)?.label || category,
      skills
    }));
  }, []);

  useEffect(() => {
    if (!isNewProject) {
      // Specifieke waarschuwing voor Snotyoung project (ID 1)
      if (safeId === "1") {
        toast({
          title: 'Let op: Special project',
          description: 'Dit project bevat speciale content types en kan niet volledig bewerkt worden via deze interface. Niet alle wijzigingen zullen opgeslagen worden.',
          duration: 10000, // Langere duur om zeker te zijn dat de gebruiker het ziet
          variant: 'destructive'
        });
      }
      
      const projectData = projects.find(p => p.id === safeId);
      if (projectData) {
        // Cast naar het admin type, omdat we weten dat de structuur compatibel is
        setProject({
          ...(projectData as unknown as AdminProject),
          activeSkillTab: 'development' // Zet standaard tab bij het laden van een project
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Project niet gevonden',
          description: 'Het project kon niet worden gevonden.'
        });
        navigate('/dashboard');
      }
    }
  }, [safeId, isNewProject, navigate, toast, projects]);

  // Zorg ervoor dat er altijd een actieve tab is
  useEffect(() => {
    if (!project.activeSkillTab && skillsByCategory.length > 0) {
      setProject(prev => ({
        ...prev,
        activeSkillTab: skillsByCategory[0].category
      }));
    }
  }, [project.activeSkillTab, skillsByCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category: CategoryType) => {
    setProject(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const handleContentChange = (index: number, field: string, value: string) => {
    setProject(prev => {
      const newContent = [...prev.content];
      newContent[index] = { 
        ...newContent[index], 
        [field]: value 
      };
      return { ...prev, content: newContent };
    });
  };

  const addContentBlock = () => {
    setProject(prev => ({
      ...prev,
      content: [...prev.content, { type: 'text', content: '' }]
    }));
  };

  const removeContentBlock = (index: number) => {
    setProject(prev => {
      const newContent = [...prev.content];
      newContent.splice(index, 1);
      return { ...prev, content: newContent };
    });
  };

  const handleContentTypeChange = (index: number, value: ContentBlockType) => {
    setProject(prev => {
      const newContent = [...prev.content];
      newContent[index] = { 
        ...newContent[index], 
        type: value
      };
      return { ...prev, content: newContent };
    });
  };

  const handleImageSizeChange = (index: number, value: ImageSizeType) => {
    setProject(prev => {
      const newContent = [...prev.content];
      newContent[index] = { 
        ...newContent[index], 
        imageSize: value 
      };
      return { ...prev, content: newContent };
    });
  };

  const handleImagePositionChange = (index: number, value: ImagePositionType) => {
    setProject(prev => {
      const newContent = [...prev.content];
      newContent[index] = { 
        ...newContent[index], 
        imagePosition: value 
      };
      return { ...prev, content: newContent };
    });
  };

  const handleDragEnd = (result: DropResult) => {
    // Als er geen bestemming is, doen we niets
    if (!result.destination) return;
    
    // Als de bron en bestemming hetzelfde zijn, doen we niets
    if (result.destination.index === result.source.index) return;
    
    // Maak een kopie van de content array
    const newContent = Array.from(project.content);
    
    // Verwijder het item uit de array
    const [removed] = newContent.splice(result.source.index, 1);
    
    // Voeg het item toe op de nieuwe plaats
    newContent.splice(result.destination.index, 0, removed);
    
    // Update de state
    setProject(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setProject(prev => {
      // Controleren of de skill al is geselecteerd
      const currentSkills = prev.skills || [];
      const newSkills = currentSkills.includes(skill)
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill];
      
      // Vind de categorie waartoe de skill behoort
      const skillCategory = findCategoryForSkill(skill);
      
      // Als de skill wordt verwijderd, controleren we of we de categorie moeten verwijderen
      if (currentSkills.includes(skill) && skillCategory) {
        // Controleer of er nog andere skills van dezelfde categorie geselecteerd zijn
        const hasOtherSkillsInCategory = newSkills.some(s => 
          skillCategories[skillCategory].includes(s)
        );
        
        // Als er geen andere skills in deze categorie zijn, verwijder de categorie
        if (!hasOtherSkillsInCategory) {
          return { 
            ...prev, 
            skills: newSkills,
            categories: prev.categories.filter(c => c !== skillCategory)
          };
        }
      }
      // Als de skill wordt toegevoegd, voeg ook de categorie toe als die nog niet bestaat
      else if (!currentSkills.includes(skill) && skillCategory && !prev.categories.includes(skillCategory)) {
        return { 
          ...prev, 
          skills: newSkills,
          categories: [...prev.categories, skillCategory]
        };
      }
      
      // Anders alleen de skills bijwerken
      return { ...prev, skills: newSkills };
    });
  };

  const saveProject = async () => {
    setIsLoading(true);
    
    try {
      // Fix voor speciale projecten zoals Snotyoung
      if (safeId === "1" && !isNewProject) {
        // Specifieke controle voor Snotyoung project
        toast({
          title: 'Let op: SNOTYOUNG project',
          description: 'Dit project kan momenteel alleen rechtstreeks in de code worden bewerkt.',
          variant: 'destructive'
        });
        setTimeout(() => navigate('/dashboard'), 1500);
        return;
      }
      
      // Genereer een ID voor nieuwe projecten
      let projectToSave = {...project};
      
      // Verwijder de activeSkillTab want die hoort niet bij de projectdata
      delete (projectToSave as any).activeSkillTab;
      
      if (isNewProject) {
        // Genereer een nieuw ID in de vorm van een string
        const highestId = projects.reduce((max, p) => {
          const idNum = parseInt(p.id);
          return isNaN(idNum) ? max : Math.max(max, idNum);
        }, 0);
        
        projectToSave.id = (highestId + 1).toString();
        
        // Zorg ervoor dat er minimaal één content-blok is
        if (!projectToSave.content || projectToSave.content.length === 0) {
          projectToSave.content = [{ type: 'text', content: 'Projectinhoud...' }];
        }
        
        // Converteer naar het juiste formaat
        const projectForStorage = convertAdminProjectToProject(projectToSave);
        
        // Gebruik de addProject functie uit de context
        addProject(projectForStorage);
        
        console.log('Nieuw project opgeslagen:', projectForStorage);
        
        toast({
          title: 'Project toegevoegd',
          description: `Het project "${projectToSave.title}" is succesvol toegevoegd.`,
        });
      } else {
        // Update een bestaand project
        // Zorg ervoor dat we het bestaande ID behouden
        projectToSave.id = safeId;
        
        // Converteer naar het juiste formaat
        const projectForStorage = convertAdminProjectToProject(projectToSave);
        
        // Gebruik de updateProject functie uit de context
        updateProject(projectForStorage);
        
        console.log('Project bijgewerkt:', projectForStorage);
        
        toast({
          title: 'Project bijgewerkt',
          description: `Het project "${projectToSave.title}" is succesvol bijgewerkt.`,
        });
      }
      
      // Navigeer terug naar het dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Fout bij opslaan:', error);
      toast({
        variant: 'destructive',
        title: 'Fout bij opslaan',
        description: 'Er is een fout opgetreden bij het opslaan van het project. Controleer de console voor details.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl">
              {isNewProject ? 'Nieuw Project Toevoegen' : 'Project Bewerken'}
            </CardTitle>
            <CardDescription>
              {isNewProject 
                ? 'Vul de details in om een nieuw project toe te voegen aan je portfolio.' 
                : 'Bewerk de details van het bestaande project.'}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              Annuleren
            </Button>
            <Button 
              onClick={saveProject} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? 'Opslaan...' : (
                <>
                  <Save size={16} /> Project opslaan
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input 
              id="title" 
              name="title" 
              value={project.title} 
              onChange={handleInputChange} 
              placeholder="Projecttitel"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Beschrijving</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={project.description} 
              onChange={handleInputChange} 
              placeholder="Korte beschrijving van het project"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Hoofdafbeelding</Label>
            <ImageUploader 
              defaultValue={project.image}
              onImageUploaded={(url) => setProject(prev => ({ ...prev, image: url }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="border rounded-md overflow-hidden w-full md:w-4/6">
                <div className="flex border-b">
                  {skillsByCategory.map(({ category, categoryLabel, skills }, tabIndex) => {
                    // Tel hoeveel skills uit deze categorie zijn geselecteerd
                    const selectedCount = (project.skills || [])
                      .filter(skill => skills.includes(skill))
                      .length;
                      
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setProject(prev => ({ ...prev, activeSkillTab: category }))}
                        className={`px-3 py-2 text-sm font-medium border-r last:border-r-0 flex-1 flex items-center justify-center gap-1.5 
                          ${project.activeSkillTab === category ? 
                            'bg-background border-b-2 border-b-primary -mb-px' : 
                            'bg-muted/30 hover:bg-muted/50'}`}
                      >
                        {categoryLabel}
                        {selectedCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground">
                            {selectedCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {skillsByCategory.map(({ category, categoryLabel, skills }) => (
                  <div 
                    key={category} 
                    className={`p-4 ${project.activeSkillTab === category ? 'block' : 'hidden'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">
                        Selecteer {categoryLabel.toLowerCase()} skills
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-6 px-2"
                          onClick={() => {
                            // Alle skills in deze categorie selecteren
                            const currentSkills = project.skills || [];
                            const categorySkills = skills.filter(skill => !currentSkills.includes(skill));
                            
                            if (categorySkills.length > 0) {
                              // Er zijn skills om toe te voegen
                              setProject(prev => ({
                                ...prev,
                                skills: [...(prev.skills || []), ...categorySkills],
                                categories: prev.categories.includes(category as CategoryType) 
                                  ? prev.categories 
                                  : [...prev.categories, category as CategoryType]
                              }));
                            }
                          }}
                        >
                          Alles
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-6 px-2"
                          onClick={() => {
                            // Alle skills in deze categorie deselecteren
                            const currentSkills = project.skills || [];
                            const newSkills = currentSkills.filter(skill => !skills.includes(skill));
                            
                            setProject(prev => {
                              // Als alle skills uit deze categorie worden verwijderd, verwijder ook de categorie
                              const newCategories = newSkills.some(skill => 
                                skillCategories[category as CategoryType]?.includes(skill)
                              )
                                ? prev.categories
                                : prev.categories.filter(c => c !== category);
                              
                              return {
                                ...prev,
                                skills: newSkills,
                                categories: newCategories,
                                activeSkillTab: prev.activeSkillTab
                              };
                            });
                          }}
                        >
                          Geen
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {skills.map(skill => {
                        const isSelected = (project.skills || []).includes(skill);
                        return (
                          <Button 
                            key={skill}
                            size="sm"
                            type="button" 
                            variant={isSelected ? "default" : "outline"}
                            className={`h-7 text-xs justify-start px-2 font-normal ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            onClick={() => handleSkillToggle(skill)}
                          >
                            {skill}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="w-full md:w-2/6 border rounded-md p-3 bg-muted/20">
                <h4 className="font-medium text-sm mb-2">Geselecteerde skills ({(project.skills || []).length})</h4>
                {(project.skills || []).length > 0 ? (
                  <div className="flex flex-wrap gap-1 max-h-[150px] overflow-y-auto">
                    {(project.skills || []).map(skill => (
                      <div 
                        key={skill}
                        className="bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5 text-xs flex items-center"
                      >
                        {skill}
                        <button 
                          className="ml-1 text-muted-foreground hover:text-destructive"
                          onClick={() => handleSkillToggle(skill)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Geen skills geselecteerd</p>
                )}
                <p className="text-xs text-muted-foreground mt-3">
                  Categorieën worden automatisch geselecteerd op basis van je gekozen skills.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Datum</Label>
            <Input 
              id="date" 
              name="date" 
              value={project.date} 
              onChange={handleInputChange} 
              placeholder="Maand Jaar (bijv. 'Januari 2023')"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Technologieën (Optioneel)</Label>
            <div className="flex flex-wrap gap-2">
              <Input 
                placeholder="Komma-gescheiden lijst van technologieën" 
                value={project.technologies?.join(', ') || ''} 
                onChange={(e) => {
                  const techs = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                  setProject(prev => ({ ...prev, technologies: techs }));
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubLink">GitHub Link (Optioneel)</Label>
              <Input 
                id="githubLink" 
                name="githubLink" 
                value={project.githubLink || ''} 
                onChange={handleInputChange} 
                placeholder="https://github.com/username/project"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="demoLink">Demo Link (Optioneel)</Label>
              <Input 
                id="demoLink" 
                name="demoLink" 
                value={project.demoLink || ''} 
                onChange={handleInputChange} 
                placeholder="https://demo-url.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagramLink">Instagram Link (Optioneel)</Label>
              <Input 
                id="instagramLink" 
                name="instagramLink" 
                value={project.instagramLink || ''} 
                onChange={handleInputChange} 
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Inhoud</Label>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={addContentBlock}
                className="flex items-center gap-1"
              >
                <Plus size={16} /> Blok toevoegen
              </Button>
            </div>
            
            <div className="mt-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="content-blocks">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {project.content.map((block, index) => (
                        <Draggable key={index} draggableId={`content-block-${index}`} index={index}>
                          {(provided) => (
                            <Card 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="p-4"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div 
                                  {...provided.dragHandleProps}
                                  className="p-2 cursor-grab rounded hover:bg-muted mr-2"
                                >
                                  <GripVertical size={16} />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                                    <div className="w-full sm:w-1/3">
                                      <Label htmlFor={`content-type-${index}`}>Type</Label>
                                      <Select 
                                        value={block.type} 
                                        onValueChange={(value) => handleContentTypeChange(index, value as ContentBlockType)}
                                      >
                                        <SelectTrigger id={`content-type-${index}`}>
                                          <SelectValue placeholder="Selecteer type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {contentTypeOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    {(block.type === 'image' || block.type === 'flex-text') && (
                                      <div className="w-full sm:w-1/3">
                                        <Label htmlFor={`image-size-${index}`}>Afbeeldingsgrootte</Label>
                                        <Select 
                                          value={block.imageSize || 'medium'} 
                                          onValueChange={(value) => handleImageSizeChange(index, value as ImageSizeType)}
                                        >
                                          <SelectTrigger id={`image-size-${index}`}>
                                            <SelectValue placeholder="Selecteer grootte" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {imageSizeOptions.map(option => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                    
                                    {(block.type === 'image' || block.type === 'flex-text') && (
                                      <div className="w-full sm:w-1/3">
                                        <Label htmlFor={`image-position-${index}`}>Afbeeldingspositie</Label>
                                        <Select 
                                          value={block.imagePosition || 'center'} 
                                          onValueChange={(value) => handleImagePositionChange(index, value as ImagePositionType)}
                                        >
                                          <SelectTrigger id={`image-position-${index}`}>
                                            <SelectValue placeholder="Selecteer positie" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {imagePositionOptions.map(option => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {block.type !== 'break' && block.type !== 'image' && (
                                    <div className="mt-2">
                                      <Label htmlFor={`content-text-${index}`}>{block.type === 'flex-text' ? 'Beschrijvende tekst' : 'Inhoud'}</Label>
                                      <Textarea 
                                        id={`content-text-${index}`} 
                                        value={block.content} 
                                        onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                                        rows={3}
                                      />
                                    </div>
                                  )}
                                  
                                  {(block.type === 'boldtext' || block.type === 'boldtexttop' || block.type === 'bold-small-subtitle') && (
                                    <div className="mt-2">
                                      <Label htmlFor={`aditional-content-${index}`}>Extra inhoud</Label>
                                      <Textarea 
                                        id={`aditional-content-${index}`} 
                                        value={block.aditionalContent || ''} 
                                        onChange={(e) => handleContentChange(index, 'aditionalContent', e.target.value)}
                                        rows={2}
                                      />
                                    </div>
                                  )}
                                  
                                  {(block.type === 'image' || block.type === 'flex-text') && (
                                    <div className="mt-2">
                                      <Label>Afbeelding</Label>
                                      <ImageUploader 
                                        defaultValue={block.content}
                                        onImageUploaded={(url) => handleContentChange(index, 'content', url)}
                                      />
                                    </div>
                                  )}
                                  
                                  {(block.type === 'image' || block.type === 'flex-text') && (
                                    <div className="mt-2">
                                      <Label htmlFor={`imgtext-${index}`}>Afbeeldingbeschrijving</Label>
                                      <Input 
                                        id={`imgtext-${index}`} 
                                        value={block.imgtext || ''} 
                                        onChange={(e) => handleContentChange(index, 'imgtext', e.target.value)}
                                        placeholder="Beschrijving voor de afbeelding"
                                      />
                                    </div>
                                  )}
                                  
                                  {(block.type === 'image' || block.type === 'flex-text') && (
                                    <div className="mt-2">
                                      <Label>Tweede afbeelding (optioneel)</Label>
                                      <ImageUploader 
                                        defaultValue={block.content2 || ''}
                                        onImageUploaded={(url) => handleContentChange(index, 'content2', url)}
                                      />
                                    </div>
                                  )}
                                  
                                  {(block.type === 'image' || block.type === 'flex-text') && block.content2 && (
                                    <div className="mt-2">
                                      <Label htmlFor={`imgtext2-${index}`}>Tweede afbeeldingbeschrijving</Label>
                                      <Input 
                                        id={`imgtext2-${index}`} 
                                        value={block.imgtext2 || ''} 
                                        onChange={(e) => handleContentChange(index, 'imgtext2', e.target.value)}
                                        placeholder="Beschrijving voor de tweede afbeelding"
                                      />
                                    </div>
                                  )}
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => removeContentBlock(index)}
                                  className="flex items-center ml-2"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Annuleren
          </Button>
          <Button 
            onClick={saveProject} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? 'Opslaan...' : (
              <>
                <Save size={16} /> Project opslaan
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Hulpfunctie om een AdminProject om te zetten naar een Project
const convertAdminProjectToProject = (adminProject: AdminProject): Project => {
  // Maak een kopie zonder de activeSkillTab
  const { activeSkillTab, ...projectWithoutTab } = adminProject;
  
  // Cast de content naar het juiste type
  // Dit is een vereenvoudiging - in een echte implementatie zou je mogelijk 
  // extra validatie moeten toepassen op de content types
  return projectWithoutTab as unknown as Project;
}; 