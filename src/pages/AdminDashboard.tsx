import { useState } from 'react';
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
  const { projects, deleteProject } = useProjects();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

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
              <Button onClick={() => navigate('/dashboard/project/new')} className="flex items-center gap-2 w-full sm:w-auto">
                <Plus size={16} /> Nieuw Project
              </Button>
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
      </div>
    </div>
  );
} 