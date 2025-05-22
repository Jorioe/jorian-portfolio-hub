import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/ImageUploader';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { useHomeContent, HomeContent } from '@/lib/HomeContext';
import { useProjects } from '@/lib/ProjectContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { homeContentService } from '@/lib/database';

export default function HomeEditor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { homeContent, updateHomeContent, loading, migrateToDatabase, reloadHomeContent } = useHomeContent();
  const { projects } = useProjects();
  const [isLoading, setIsLoading] = useState(false);
  const [editableContent, setEditableContent] = useState<HomeContent>({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    aboutTitle: '',
    aboutText1: '',
    aboutText2: '',
    aboutText3: '',
    aboutImage: '',
    ctaTitle: '',
    ctaText: '',
    featuredProjects: [],
    featuredProjectsTitle: '',
    featuredProjectsSubtitle: '',
    skillsTitle: '',
    skillsItems: [],
    footerLinks: []
  });
  
  // Laad de huidige content wanneer de context is geladen
  useEffect(() => {
    if (!loading) {
      console.log('Setting editableContent with featuredProjects:', homeContent.featuredProjects);
      setEditableContent(homeContent);
    }
  }, [homeContent, loading]);

  // Update een veld in de home content
  const handleInputChange = (field: keyof HomeContent, value: any) => {
    setEditableContent((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Voeg een project toe aan de uitgelichte projecten
  const addFeaturedProject = (projectId: string) => {
    if (editableContent.featuredProjects.includes(projectId)) return;
    
    const updatedProjects = [...editableContent.featuredProjects, projectId];
    console.log('Project toegevoegd:', projectId);
    console.log('Nieuwe lijst met featured projects:', updatedProjects);
    handleInputChange('featuredProjects', updatedProjects);
  };

  // Verwijder een project uit de uitgelichte projecten
  const removeFeaturedProject = (projectId: string) => {
    console.log('Verwijderen van project:', projectId);
    console.log('Huidige featuredProjects:', editableContent.featuredProjects);
    const updatedProjects = editableContent.featuredProjects.filter(id => id !== projectId);
    console.log('Geüpdatete featuredProjects:', updatedProjects);
    handleInputChange('featuredProjects', updatedProjects);
  };
  
  // Verplaats een project omhoog in de lijst
  const moveProjectUp = (index: number) => {
    if (index <= 0) return; // Al bovenaan
    
    const newProjects = [...editableContent.featuredProjects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[index - 1];
    newProjects[index - 1] = temp;
    
    handleInputChange('featuredProjects', newProjects);
  };
  
  // Verplaats een project omlaag in de lijst
  const moveProjectDown = (index: number) => {
    if (index >= editableContent.featuredProjects.length - 1) return; // Al onderaan
    
    const newProjects = [...editableContent.featuredProjects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[index + 1];
    newProjects[index + 1] = temp;
    
    handleInputChange('featuredProjects', newProjects);
  };

  // Voeg een functie toe om database toegang te testen
  const handleTestDatabaseAccess = async () => {
    try {
      console.log('Testing database access...');
      const { success, error } = await homeContentService.testDatabaseAccess();
      
      if (success) {
        toast({
          title: "Database toegang succesvol",
          description: "Zowel lees- als schrijftoegang is beschikbaar. Bekijk de console voor details.",
        });
      } else {
        toast({
          title: "Database toegangsprobleem",
          description: "Er was een probleem met de toegang tot de database. Bekijk de console voor details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error testing database access:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het testen van de database toegang.",
        variant: "destructive"
      });
    }
  };

  // Opslaan van de content
  const handleSave = () => {
    setIsLoading(true);

    try {
      console.log('HomeEditor - Opslaan van content', editableContent);
      console.log('HomeEditor - Featured Projects voor opslaan:', editableContent.featuredProjects);
      
      updateHomeContent(editableContent);
      
      toast({
        title: "Opgeslagen",
        description: "De homepagina content is succesvol opgeslagen."
      });

      // Navigeer terug naar dashboard na opslaan
      setTimeout(() => {
        navigate('/dashboard');
      }, 500); // Korte timeout zodat de gebruiker de toast kan zien
      
    } catch (error) {
      console.error('Error saving home content:', error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de content.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Content laden...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-3xl font-bold">Homepagina Bewerken</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleTestDatabaseAccess} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200"
            >
              Test DB Toegang
            </Button>
            <Button 
              onClick={() => migrateToDatabase()} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200"
            >
              Migreer naar Database
            </Button>
            <Button 
              onClick={() => reloadHomeContent()} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              Herlaad Content
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Wijzigingen opslaan
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Hero Sectie</CardTitle>
            <CardDescription>
              De eerste sectie die bezoekers zien op je homepagina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="heroTitle">Titel</Label>
              <Input
                id="heroTitle"
                value={editableContent.heroTitle}
                onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Ondertitel</Label>
              <Input
                id="heroSubtitle"
                value={editableContent.heroSubtitle}
                onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Hero Afbeelding</Label>
              <div className="mt-2">
                <ImageUploader
                  defaultValue={editableContent.heroImage}
                  onImageUploaded={(url) => handleInputChange('heroImage', url)}
                />
              </div>
              {editableContent.heroImage && (
                <div className="mt-4 relative w-48 h-48 rounded-lg overflow-hidden">
                  <img 
                    src={editableContent.heroImage} 
                    alt="Hero afbeelding" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Accordion type="single" collapsible defaultValue="about">
          <AccordionItem value="about">
            <AccordionTrigger>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Over Mij Sectie</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label htmlFor="aboutTitle">Titel</Label>
                    <Input
                      id="aboutTitle"
                      value={editableContent.aboutTitle}
                      onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aboutText1">Paragraaf 1</Label>
                    <Textarea
                      id="aboutText1"
                      value={editableContent.aboutText1}
                      onChange={(e) => handleInputChange('aboutText1', e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aboutText2">Paragraaf 2</Label>
                    <Textarea
                      id="aboutText2"
                      value={editableContent.aboutText2}
                      onChange={(e) => handleInputChange('aboutText2', e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aboutText3">Paragraaf 3</Label>
                    <Textarea
                      id="aboutText3"
                      value={editableContent.aboutText3}
                      onChange={(e) => handleInputChange('aboutText3', e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>About Afbeelding (mobiel)</Label>
                    <div className="mt-2">
                      <ImageUploader
                        defaultValue={editableContent.aboutImage}
                        onImageUploaded={(url) => handleInputChange('aboutImage', url)}
                      />
                    </div>
                    {editableContent.aboutImage && (
                      <div className="mt-4 relative w-48 h-48 rounded-lg overflow-hidden">
                        <img 
                          src={editableContent.aboutImage} 
                          alt="About afbeelding" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Featured Projects Section - Volledig opnieuw */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Uitgelichte Projecten</CardTitle>
            <CardDescription>
              Selecteer projecten om op de homepagina uit te lichten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="featuredProjectsTitle">Titel</Label>
                <Input
                  id="featuredProjectsTitle"
                  value={editableContent.featuredProjectsTitle}
                  onChange={(e) => handleInputChange('featuredProjectsTitle', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="featuredProjectsSubtitle">Ondertitel</Label>
                <Textarea
                  id="featuredProjectsSubtitle"
                  value={editableContent.featuredProjectsSubtitle}
                  onChange={(e) => handleInputChange('featuredProjectsSubtitle', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Uitgelichte Projecten Selecteren</Label>
                <div className="mt-2">
                  <Select 
                    onValueChange={(value) => addFeaturedProject(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een project om toe te voegen" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects
                        .filter(project => !editableContent.featuredProjects.includes(project.id))
                        .map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Geselecteerde Projecten</h3>
                {editableContent.featuredProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Geen projecten geselecteerd</p>
                ) : (
                  <div className="space-y-2">
                    {editableContent.featuredProjects.map((projectId, index) => {
                      const project = projects.find(p => p.id === projectId);
                      return (
                        <div key={projectId} className="flex items-center justify-between p-3 bg-secondary/20 rounded-md">
                          <span>{project?.title || 'Onbekend project'}</span>
                          <div className="flex items-center gap-2">
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              onClick={() => moveProjectUp(index)}
                              className="h-8 w-8 p-0 text-gray-500 hover:text-primary"
                              disabled={index === 0}
                            >
                              <MoveUp size={16} />
                              <span className="sr-only">Verplaats omhoog</span>
                            </Button>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              onClick={() => moveProjectDown(index)}
                              className="h-8 w-8 p-0 text-gray-500 hover:text-primary"
                              disabled={index === editableContent.featuredProjects.length - 1}
                            >
                              <MoveDown size={16} />
                              <span className="sr-only">Verplaats omlaag</span>
                            </Button>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFeaturedProject(projectId)}
                              className="h-8 w-8 p-0 text-gray-500 hover:text-destructive"
                            >
                              <Trash2 size={16} />
                              <span className="sr-only">Verwijderen</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Accordion type="single" collapsible defaultValue="skills">
          <AccordionItem value="skills">
            <AccordionTrigger>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Vaardigheden Sectie</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label htmlFor="skillsTitle">Titel</Label>
                    <Input
                      id="skillsTitle"
                      value={editableContent.skillsTitle}
                      onChange={(e) => handleInputChange('skillsTitle', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Vaardigheden Categorieën</Label>
                    {editableContent.skillsItems?.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="border rounded-md p-4 space-y-3">
                        <div>
                          <Label htmlFor={`category-${categoryIndex}`}>Categorie Naam</Label>
                          <Input
                            id={`category-${categoryIndex}`}
                            value={category.category}
                            onChange={(e) => {
                              const updatedSkills = [...editableContent.skillsItems];
                              updatedSkills[categoryIndex].category = e.target.value;
                              handleInputChange('skillsItems', updatedSkills);
                            }}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`skills-${categoryIndex}`}>Vaardigheden (komma-gescheiden)</Label>
                          <Textarea
                            id={`skills-${categoryIndex}`}
                            value={category.items.join(', ')}
                            onChange={(e) => {
                              const skillsArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                              const updatedSkills = [...editableContent.skillsItems];
                              updatedSkills[categoryIndex].items = skillsArray;
                              handleInputChange('skillsItems', updatedSkills);
                            }}
                            className="mt-1"
                          />
                        </div>
                        
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updatedSkills = editableContent.skillsItems.filter((_, i) => i !== categoryIndex);
                            handleInputChange('skillsItems', updatedSkills);
                          }}
                        >
                          Verwijder categorie
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const updatedSkills = [
                          ...editableContent.skillsItems || [],
                          { category: 'Nieuwe Categorie', items: ['Nieuwe vaardigheid'] }
                        ];
                        handleInputChange('skillsItems', updatedSkills);
                      }}
                    >
                      Voeg categorie toe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* CTA Section */}
        <Accordion type="single" collapsible defaultValue="cta">
          <AccordionItem value="cta">
            <AccordionTrigger>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Call-to-Action Sectie</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label htmlFor="ctaTitle">Titel</Label>
                    <Input
                      id="ctaTitle"
                      value={editableContent.ctaTitle}
                      onChange={(e) => handleInputChange('ctaTitle', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctaText">Tekst</Label>
                    <Textarea
                      id="ctaText"
                      value={editableContent.ctaText}
                      onChange={(e) => handleInputChange('ctaText', e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Footer Links Section */}
        <Accordion type="single" collapsible defaultValue="footerLinks">
          <AccordionItem value="footerLinks">
            <AccordionTrigger>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Footer Links</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <Label>Sociale Media & Links</Label>
                    {editableContent.footerLinks?.map((link, linkIndex) => (
                      <div key={linkIndex} className="border rounded-md p-4 space-y-3">
                        <div>
                          <Label htmlFor={`link-title-${linkIndex}`}>Link Titel</Label>
                          <Input
                            id={`link-title-${linkIndex}`}
                            value={link.title}
                            onChange={(e) => {
                              const updatedLinks = [...editableContent.footerLinks];
                              updatedLinks[linkIndex].title = e.target.value;
                              handleInputChange('footerLinks', updatedLinks);
                            }}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`link-url-${linkIndex}`}>URL</Label>
                          <Input
                            id={`link-url-${linkIndex}`}
                            value={link.url}
                            onChange={(e) => {
                              const updatedLinks = [...editableContent.footerLinks];
                              updatedLinks[linkIndex].url = e.target.value;
                              handleInputChange('footerLinks', updatedLinks);
                            }}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`link-icon-${linkIndex}`}>Icon (optioneel)</Label>
                          <Input
                            id={`link-icon-${linkIndex}`}
                            value={link.icon || ''}
                            onChange={(e) => {
                              const updatedLinks = [...editableContent.footerLinks];
                              updatedLinks[linkIndex].icon = e.target.value;
                              handleInputChange('footerLinks', updatedLinks);
                            }}
                            className="mt-1"
                          />
                        </div>
                        
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updatedLinks = editableContent.footerLinks.filter((_, i) => i !== linkIndex);
                            handleInputChange('footerLinks', updatedLinks);
                          }}
                        >
                          Verwijder link
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const updatedLinks = [
                          ...editableContent.footerLinks || [],
                          { title: 'Nieuwe Link', url: 'https://' }
                        ];
                        handleInputChange('footerLinks', updatedLinks);
                      }}
                    >
                      Voeg link toe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Bottom buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Annuleren
          </Button>
          
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="flex items-center gap-2"
            size="lg"
          >
            <Save size={16} />
            Wijzigingen opslaan
          </Button>
        </div>
      </div>
    </div>
  );
} 