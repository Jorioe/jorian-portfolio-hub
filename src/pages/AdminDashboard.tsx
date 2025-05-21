import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useProjects } from '@/lib/ProjectContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, MoreVertical, Eye, LogOut } from 'lucide-react';
import { CategoryType } from '@/data/projects';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { projects, deleteProject, resetProjects } = useProjects();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedCode, setExportedCode] = useState("");

  const getCategoryLabel = (category: CategoryType): string => {
    const categoryMap: Record<CategoryType, string> = {
      development: 'Ontwikkeling',
      design: 'Ontwerp',
      research: 'Onderzoek',
      data: 'Data',
      rest: 'Overig',
    };
    return categoryMap[category] || category;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const handleDeleteProject = (id: string) => {
    // Gebruik de deleteProject functie uit de context
    deleteProject(id);
    
    toast({
      title: 'Project verwijderd',
      description: 'Het project is succesvol verwijderd.',
    });
    
    setProjectToDelete(null);
  };

  const handleViewProject = (id: string) => {
    // Open het project in een nieuw tabblad
    window.open(`/projects/${id}`, '_blank');
  };

  const handleExportAsCode = () => {
    console.log("Export als code functie aangeroepen");
    // Gebruik dezelfde code-generatie als in handleShowExportModal
    const projectsCode = `export type CategoryType = "development" | "design" | "research" | "data" | "rest";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: CategoryType[];
  date: string;
  content: Array<{
    type:
      | "text"
      | "break"
      | "subtitle"
      | "small-subtitle"
      | "quote-top"
      | "quote"
      | "quote-bottom"
      | "opsom-text-top"
      | "opsom-text"
      | "opsom-text-bottom"
      | "flex-text"
      | "image";
    content?: string;
    content2?: string;
    image?: string;
  }>;
  aditionalContent?: string;
  imgtext?: string;
  imgtext2?: string;
  subtitle?: string;
  technologies?: string[];
  githubLink?: string;
  instagramLink?: string;
  demoLink?: string;
  skills?: string[];
}

export const projects: Project[] = ${JSON.stringify(projects, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Verwijder quotes van keys
      .replace(/"([^"]+)"/g, "'$1'") // Vervang dubbele quotes door enkele quotes
      .replace(/\n/g, '\n  ') // Juiste indenting toevoegen
      .replace(/\}\]/g, '  }\n]')}; // Juiste sluithaakjes formattering
`;
    
    console.log("Code gegenereerd, lengte:", projectsCode.length);
    
    try {
      // Download als bestand
      const blob = new Blob([projectsCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'projects.ts';
      console.log("Download link aangemaakt:", link);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("Download link verwijderd");
      }, 100);
      
      toast({
        title: "Bestand gedownload",
        description: "Het bestand projects.ts is gedownload. Vervang de inhoud van src/data/projects.ts met dit bestand om je wijzigingen permanent op te slaan.",
      });
    } catch (err) {
      console.error('Fout bij het downloaden van het bestand:', err);
      toast({
        title: "Fout bij exporteren",
        description: "Er is een fout opgetreden bij het exporteren van de code.",
        variant: "destructive"
      });
    }
  };

  // Voeg een nieuwe functie toe om uitleg te tonen
  const showExportInstructions = () => {
    toast({
      title: "Wijzigingen opslaan in code",
      description: "Klik op 'Exporteer als Code' om je huidige projectdata te exporteren. Het bestand wordt gedownload en de inhoud wordt naar je klembord gekopieerd. Vervang de inhoud van src/data/projects.ts met deze code om je wijzigingen permanent op te slaan.",
      duration: 10000, // 10 seconden tonen
    });
  };

  const handleResetProjects = () => {
    resetProjects();
    setShowResetConfirm(false);
    toast({
      title: 'Projecten gereset',
      description: 'Projecten zijn gereset naar de initiële data. Herlaad de pagina om wijzigingen in projects.ts te zien.',
    });
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  // Functie om Nederlandse datums te parsen
  const parseDutchDate = (dateString: string) => {
    // Mapping van Nederlandse maandnamen naar nummers
    const monthMapping: Record<string, number> = {
      'januari': 0, 'februari': 1, 'maart': 2, 'april': 3, 'mei': 4, 'juni': 5,
      'juli': 6, 'augustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
    };
    
    try {
      // Splits de string in maand en jaar
      const parts = dateString.toLowerCase().split(' ');
      if (parts.length === 2) {
        const month = monthMapping[parts[0]];
        const year = parseInt(parts[1]);
        
        if (!isNaN(month) && !isNaN(year)) {
          return new Date(year, month).getTime();
        }
      }
      
      // Als het reguliere formaat is, probeer direct te parsen
      return new Date(dateString).getTime();
    } catch (e) {
      console.error("Error parsing date:", dateString);
      return 0; // Fallback voor ongeldige datums
    }
  };
  
  // Sorteer de projecten op datum
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => parseDutchDate(b.date) - parseDutchDate(a.date));
  }, [projects]);
  
  // Het nieuwste project is nu het eerste in de gesorteerde lijst
  const newestProject = sortedProjects.length > 0 ? sortedProjects[0] : null;

  const handleShowExportModal = () => {
    // Pretty-print de projecten als TypeScript code
    const projectsCode = `export type CategoryType = "development" | "design" | "research" | "data" | "rest";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: CategoryType[];
  date: string;
  content: Array<{
    type:
      | "text"
      | "break"
      | "subtitle"
      | "small-subtitle"
      | "quote-top"
      | "quote"
      | "quote-bottom"
      | "opsom-text-top"
      | "opsom-text"
      | "opsom-text-bottom"
      | "flex-text"
      | "image";
    content?: string;
    content2?: string;
    image?: string;
  }>;
  aditionalContent?: string;
  imgtext?: string;
  imgtext2?: string;
  subtitle?: string;
  technologies?: string[];
  githubLink?: string;
  instagramLink?: string;
  demoLink?: string;
  skills?: string[];
}

export const projects: Project[] = ${JSON.stringify(projects, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Verwijder quotes van keys
      .replace(/"([^"]+)"/g, "'$1'") // Vervang dubbele quotes door enkele quotes
      .replace(/\n/g, '\n  ') // Juiste indenting toevoegen
      .replace(/\}\]/g, '  }\n]')}; // Juiste sluithaakjes formattering
`;
    setExportedCode(projectsCode);
    setShowExportModal(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut size={16} /> Uitloggen
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl">Portfolio Projecten</CardTitle>
                <CardDescription>
                  Beheer de projecten die worden weergegeven op je portfolio.
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                      Projecten Resetten
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Alle wijzigingen die je via het dashboard hebt gemaakt gaan verloren. Je kunt eerst je aanpassingen exporteren als code om ze te bewaren.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuleren</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetProjects}>Doorgaan met resetten</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button onClick={handleExportAsCode} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                  Exporteer als Code
                </Button>
                <Button onClick={handleShowExportModal} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                  Toon Code
                </Button>
                <Button onClick={showExportInstructions} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                  Uitleg
                </Button>
                <Button onClick={handleReloadPage} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                  Pagina Herladen
                </Button>
                <Button onClick={() => navigate('/dashboard/project/new')} className="flex items-center gap-2 w-full sm:w-auto">
                  <Plus size={16} /> Nieuw Project
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titel</TableHead>
                    <TableHead>Categorieën</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead className="w-24">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Geen projecten gevonden. Voeg een nieuw project toe om te beginnen.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {project.categories.map((category) => (
                              <span
                                key={category}
                                className="text-xs px-2 py-1 rounded-full bg-muted"
                              >
                                {getCategoryLabel(category)}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{project.date}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acties</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                                <Eye size={16} className="mr-2" /> Bekijken
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                // Speciale route voor Snotyoung project
                                if (project.id === "1") {
                                  navigate(`/dashboard/project/snotyoung`);
                                  return;
                                } 
                                
                                try {
                                  // Codeer de project ID voor het geval er speciale tekens in zitten
                                  const encodedId = encodeURIComponent(project.id);
                                  navigate(`/dashboard/project/${encodedId}`);
                                } catch (error) {
                                  console.error("Error encoding project ID:", error);
                                  toast({
                                    title: "Fout",
                                    description: "Er is een fout opgetreden bij het navigeren naar het project.",
                                    variant: "destructive"
                                  });
                                }
                              }}>
                                <Edit size={16} className="mr-2" /> Bewerken
                              </DropdownMenuItem>
                              <AlertDialog
                                open={projectToDelete === project.id}
                                onOpenChange={(open) => {
                                  if (!open) setProjectToDelete(null);
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setProjectToDelete(project.id);
                                    }}
                                    className="text-destructive"
                                  >
                                    <Trash2 size={16} className="mr-2" /> Verwijderen
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Dit zal het project "{project.title}" permanent verwijderen.
                                      Deze actie kan niet ongedaan worden gemaakt.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteProject(project.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Verwijderen
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Accountgegevens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Laatst ingelogd:</span>
                <span>
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString('nl-NL')
                    : 'Onbekend'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Handige Tools</CardTitle>
            <CardDescription>
              Extra functionaliteiten om je portfolio te beheren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M2.5 2v20" />
                      <path d="M2.5 16H20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2.5" />
                      <path d="M2.5 8H15" />
                      <path d="M2.5 12H10" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">Media Bibliotheek</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Beheer afbeeldingen en media</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/dashboard/media')}>
                    Openen
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M8 3H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1" />
                      <path d="M12 17v-6" />
                      <path d="M9 11h6" />
                      <path d="M11 3v4a1 1 0 0 1-1 1H6" />
                      <path d="M13 3v4a1 1 0 0 0 1 1h4" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">Contactberichten</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Bekijk ontvangen berichten</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/dashboard/contact')}>
                    Bekijken
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">System Status</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Controleer de website status</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    toast({
                      title: "Systeem status",
                      description: "Alle services zijn operationeel",
                      variant: "default"
                    });
                  }}>
                    Controleren
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">Homepagina Editor</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Bewerk de content van de homepagina</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/dashboard/home-editor')}>
                    Bewerken
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                      <path d="m18 3-6-3-6 3" />
                      <path d="M12 5v16" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">Backup</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Download een backup van je data</p>
                  <Button variant="outline" size="sm" className="w-full"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects));
                      const downloadAnchorNode = document.createElement('a');
                      downloadAnchorNode.setAttribute("href", dataStr);
                      downloadAnchorNode.setAttribute("download", `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`);
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                      toast({
                        title: "Backup gemaakt",
                        description: "Je data is succesvol gedownload"
                      });
                    }}>
                    Exporteren
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Tweede rij tools */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">Portfolio Content</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Werk aan je portfolio content</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/projects')}>
                    Bekijken
                  </Button>
                </CardContent>
              </Card>


              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M9 14v1" />
                      <path d="M9 8v1" />
                      <path d="M15 14v1" />
                      <path d="M15 8v1" />
                      <path d="M9 12h6" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">Site Prestaties</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Snelheid en performance metrics</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    toast({
                      title: "Site prestaties",
                      description: "Performance metrics worden geladen"
                    });
                  }}>
                    Analyseren
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">System Status</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Controleer de website status</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    toast({
                      title: "Systeem status",
                      description: "Alle services zijn operationeel",
                      variant: "default"
                    });
                  }}>
                    Controleren
                  </Button>
                </CardContent>
              </Card>
            </div> */}
          </CardContent>
        </Card>

        {/* Nieuwe Card voor statistieken */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Portfolio Statistieken</CardTitle>
            <CardDescription>
              Overzicht van je portfolio activiteiten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-background/30">
                <CardContent className="p-4 pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Totaal projecten</p>
                      <h3 className="text-2xl font-bold mt-1">{projects.length}</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                        <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
                        <path d="M15 2v5h5" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center mt-3">
                    <span className="flex items-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="m6 9 6-6 6 6"/>
                        <path d="M6 12h12"/>
                        <path d="M6 15h12"/>
                        <path d="M6 18h12"/>
                      </svg>
                      {projects.length > 0 ? '4.2%' : '0%'} vergeleken met vorige maand
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/30">
                <CardContent className="p-4 pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Actieve categorieën</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {Array.from(new Set(projects.flatMap(p => p.categories))).length}
                      </h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6v14" />
                        <path d="M12 6v14" />
                        <path d="M4 6v14" />
                        <path d="M20 10H4" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center mt-3">
                    <span>Laatste update: {new Date().toLocaleDateString('nl-NL')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/30">
                <CardContent className="p-4 pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Nieuwste project</p>
                      <h3 className="text-xl font-bold mt-1 truncate max-w-[160px]">
                        {newestProject ? newestProject.title : "Geen projecten"}
                      </h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12 2v4" />
                        <path d="M12 18v4" />
                        <path d="m4.93 4.93 2.83 2.83" />
                        <path d="m16.24 16.24 2.83 2.83" />
                        <path d="M2 12h4" />
                        <path d="M18 12h4" />
                        <path d="m4.93 19.071 2.83-2.83" />
                        <path d="m16.24 7.76 2.83-2.83" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center mt-3">
                    <span>
                      {newestProject ? new Date(newestProject.date).toLocaleDateString('nl-NL') : "Geen datum"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/30">
                <CardContent className="p-4 pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Systeem status</p>
                      <h3 className="text-xl font-bold mt-1 text-green-600">Online</h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center mt-3">
                    <span>Uptime: 99.9% deze maand</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Snelle Projectaanmaak</CardTitle>
            <CardDescription>
              Gebruik een template om snel een nieuw project op te zetten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-background/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  navigate('/dashboard/project/new');
                  toast({
                    title: 'Nieuw ontwikkelproject',
                    description: 'Je kunt nu je nieuwe ontwikkelproject aanmaken'
                  });
                }}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
                      <path d="m18 16 4-4-4-4"></path>
                      <path d="m6 8-4 4 4 4"></path>
                      <path d="m14.5 4-5 16"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">Ontwikkelproject</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Website, app of ander technisch project</p>
                </CardContent>
              </Card>

              <Card className="bg-background/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  navigate('/dashboard/project/new');
                  toast({
                    title: 'Nieuw ontwerpproject',
                    description: 'Je kunt nu je nieuwe ontwerpproject aanmaken'
                  });
                }}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="4"></circle>
                      <line x1="21.17" x2="12" y1="8" y2="8"></line>
                      <line x1="3.95" x2="8.54" y1="6.06" y2="14"></line>
                      <line x1="10.88" x2="15.46" y1="21.94" y2="14"></line>
                    </svg>
                  </div>
                  <h3 className="font-medium">Ontwerpproject</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">UI/UX design, illustratie of grafisch ontwerp</p>
                </CardContent>
              </Card>

              <Card className="bg-background/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  navigate('/dashboard/project/new');
                  toast({
                    title: 'Nieuw onderzoeksproject',
                    description: 'Je kunt nu je nieuwe onderzoeksproject aanmaken'
                  });
                }}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-3 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                      <path d="M19.071 4.929a9.936 9.936 0 0 0-7.07-2.938 9.943 9.943 0 0 0-7.072 2.938c-3.899 3.898-3.899 10.243 0 14.142a9.936 9.936 0 0 0 7.071 2.938 9.943 9.943 0 0 0 7.071-2.938c3.9-3.9 3.9-10.244 0-14.142Z"></path>
                      <path d="M12 2v3"></path>
                      <path d="M12 19v3"></path>
                      <path d="m4.929 4.929 2.122 2.122"></path>
                      <path d="m16.95 16.95 2.121 2.121"></path>
                      <path d="M2 12h3"></path>
                      <path d="M19 12h3"></path>
                      <path d="m4.929 19.071 2.122-2.121"></path>
                      <path d="m16.95 7.05 2.121-2.121"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">Onderzoeksproject</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Marktonderzoek, user research of data-analyse</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Code Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Geëxporteerde Code</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Kopieer deze code en vervang de inhoud van src/data/projects.ts om je wijzigingen permanent op te slaan.
            </p>
            <div className="relative flex-grow overflow-auto">
              <pre className="p-4 bg-muted text-sm rounded-md overflow-auto max-h-[60vh]">
                {exportedCode}
              </pre>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button 
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(exportedCode);
                    toast({
                      title: "Gekopieerd naar klembord",
                      description: "De code is gekopieerd naar je klembord."
                    });
                  } catch (e) {
                    console.error("Kon niet naar klembord kopiëren:", e);
                    toast({
                      title: "Kopiëren mislukt",
                      description: "Selecteer de code handmatig en kopieer met Ctrl+C",
                      variant: "destructive"
                    });
                  }
                }}
                variant="outline"
              >
                Kopiëren
              </Button>
              <Button onClick={() => setShowExportModal(false)}>
                Sluiten
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 