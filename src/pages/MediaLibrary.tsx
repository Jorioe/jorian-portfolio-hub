import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Copy, MoreVertical, Trash2, Image, Upload, X, Eye, Download } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from 'uuid';

// Interface voor media items
interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: string;
}

// Lokale opslag key
const STORAGE_KEY = 'portfolio_media_library';

export default function MediaLibrary() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Laad media items bij initialisatie
  useEffect(() => {
    const loadMediaItems = () => {
      try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        if (storedItems) {
          setMediaItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error('Error loading media items:', error);
        setMediaItems([]);
      }
    };

    loadMediaItems();
  }, []);

  // Helper om media items op te slaan
  const saveMediaItems = (items: MediaItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving media items:', error);
    }
  };

  // Dropzone voor uploads
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    onDrop: (acceptedFiles) => {
      handleFileUpload(acceptedFiles);
    },
  });

  // Functie om bestanden te uploaden
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    // Maak een array om alle beloftes te verzamelen
    const uploadPromises = files.map(file => {
      return new Promise<MediaItem>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
          const mediaItem: MediaItem = {
            id: uuidv4(),
            name: file.name,
            url: reader.result as string,
            type: file.type,
            size: file.size,
            uploadDate: new Date().toISOString()
          };
          
          resolve(mediaItem);
        };
        
        reader.onerror = () => {
          reject(new Error(`Failed to read file: ${file.name}`));
        };
        
        reader.readAsDataURL(file);
      });
    });
    
    try {
      // Wacht tot alle uploads zijn voltooid
      const newMediaItems = await Promise.all(uploadPromises);
      
      // Voeg de nieuwe items toe aan de bestaande lijst
      const updatedMediaItems = [...mediaItems, ...newMediaItems];
      setMediaItems(updatedMediaItems);
      saveMediaItems(updatedMediaItems);
      
      toast({
        title: "Upload voltooid",
        description: `${files.length} bestand(en) succesvol geüpload.`
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload mislukt",
        description: "Er is iets misgegaan bij het uploaden van de bestanden.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Functie om een mediabestand te verwijderen
  const handleDeleteItem = (id: string) => {
    const updatedItems = mediaItems.filter(item => item.id !== id);
    setMediaItems(updatedItems);
    saveMediaItems(updatedItems);
    setItemToDelete(null);
    
    toast({
      title: "Media verwijderd",
      description: "Het mediabestand is succesvol verwijderd."
    });
  };

  // Functie om een link naar het clipboard te kopiëren
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link gekopieerd",
          description: "De URL is naar het klembord gekopieerd."
        });
      })
      .catch(err => {
        console.error('Kon link niet kopiëren:', err);
        toast({
          title: "Kon link niet kopiëren",
          description: "Er is iets misgegaan bij het kopiëren van de URL.",
          variant: "destructive"
        });
      });
  };

  // Formattering voor bestandsgrootte
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  // Formattering voor datum
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Gefilterde items op basis van zoekterm
  const filteredItems = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorteer items op datum, nieuwste eerst
  const sortedItems = [...filteredItems].sort((a, b) => {
    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
  });

  // Lijst van statische afbeeldingen om te importeren
  const staticImages = [
    '/img/pfpic.png',
    '/img/newz-1.jpg',
    '/img/newz-2.jpg',
    '/img/newz-3.png',
    '/img/NewZlogo.png',
    '/img/FW-lineup.png',
    '/img/FW-concept.png',
    '/img/FW-paid-1.png',
    '/img/FW-paid-2.png',
    '/img/FW-earned-1.png',
    '/img/FW-earned-2.png',
    '/img/FW-poster-1.png',
    '/img/FW-poster-2.png',
    '/img/FW-poster-3.png',
    '/img/FW-tiktoks.png',
    '/img/FW-reels.png',
    '/img/FW-posts.png',
    '/img/SY-stat-2.png',
    '/img/SY-stat-3.png',
    '/img/SY-stat-4.png',
    '/img/SY-stat-5.png',
    '/img/SY-kl-1.png',
    '/img/SY-kl-2.png',
    '/img/SY-stat.png',
    '/img/SY-BG-edit2.png',
    '/img/Frostwave-FB-bg.png',
    '/img/logoJB2.png'
  ];

  // Functie om statische afbeeldingen te importeren
  const handleImportStaticImages = async () => {
    // Filter afbeeldingen die nog niet in de bibliotheek zijn
    const existingUrls = mediaItems.map(item => item.url);
    const newImages = staticImages.filter(img => !existingUrls.some(url => url.includes(img)));
    
    if (newImages.length === 0) {
      toast({
        title: "Geen nieuwe afbeeldingen",
        description: "Alle statische afbeeldingen zijn al geïmporteerd."
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Voor elke afbeelding, maak een nieuw media item
      const newMediaItems = await Promise.all(newImages.map(async (imagePath) => {
        // Haal de bestandsnaam uit het pad
        const fileName = imagePath.split('/').pop() || 'unknown';
        
        // Bepaal het type op basis van de extensie
        const extension = fileName.split('.').pop()?.toLowerCase();
        let mimeType = 'image/png'; // standaard
        if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
        else if (extension === 'gif') mimeType = 'image/gif';
        else if (extension === 'webp') mimeType = 'image/webp';
        
        return {
          id: uuidv4(),
          name: fileName,
          url: imagePath,
          type: mimeType,
          size: 0, // Grootte kan niet bepaald worden voor statische bestanden
          uploadDate: new Date().toISOString()
        };
      }));
      
      // Voeg de nieuwe items toe aan de bestaande lijst
      const updatedMediaItems = [...mediaItems, ...newMediaItems];
      setMediaItems(updatedMediaItems);
      saveMediaItems(updatedMediaItems);
      
      toast({
        title: "Import voltooid",
        description: `${newMediaItems.length} statische afbeelding(en) succesvol geïmporteerd.`
      });
    } catch (error) {
      console.error('Error importing static images:', error);
      toast({
        title: "Import mislukt",
        description: "Er is iets misgegaan bij het importeren van de afbeeldingen.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

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
            <h1 className="text-3xl font-bold">Media Bibliotheek</h1>
          </div>
          
          <Button
            onClick={handleImportStaticImages}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            Importeer statische afbeeldingen
          </Button>
        </div>

        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <TabsList>
              <TabsTrigger value="all">Alle media</TabsTrigger>
              <TabsTrigger value="images">Afbeeldingen</TabsTrigger>
            </TabsList>
            
            <div className="w-full sm:w-auto max-w-xs">
              <Input
                placeholder="Zoek mediabestanden..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">Media Bibliotheek</CardTitle>
                    <CardDescription>
                      Beheer afbeeldingen en mediabestanden voor je portfolio.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}>
                    <input {...getInputProps()} />
                    {isUploading ? (
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent mb-2"></div>
                        <p>Uploading...</p>
                      </div>
                    ) : isDragActive ? (
                      <div>
                        <Upload className="h-10 w-10 text-primary mx-auto mb-2" />
                        <p>Sleep je bestanden hier...</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-10 w-10 text-muted-foreground/70 mx-auto mb-2" />
                        <p>Sleep bestanden hier of klik om te uploaden</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Ondersteunde formaten: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {sortedItems.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      Geen mediabestanden gevonden. Upload bestanden om te beginnen.
                    </div>
                  ) : (
                    sortedItems.map((item) => (
                      <div key={item.id} className="group relative rounded-lg overflow-hidden bg-secondary/20 border aspect-square">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {item.type.startsWith('image/') ? (
                            <img 
                              src={item.url} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full p-4">
                              <Image className="h-10 w-10 text-muted-foreground mb-2" />
                              <span className="text-xs text-center truncate w-full">{item.name}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs truncate">{item.name}</p>
                        </div>
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="icon" className="h-8 w-8">
                                <MoreVertical size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel className="text-xs">Beheer media</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setPreviewItem(item);
                                setShowPreview(true);
                              }}>
                                <Eye size={14} className="mr-2" /> Bekijken
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopyLink(item.url)}>
                                <Copy size={14} className="mr-2" /> Kopieer URL
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                const a = document.createElement('a');
                                a.href = item.url;
                                a.download = item.name;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                              }}>
                                <Download size={14} className="mr-2" /> Downloaden
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => setItemToDelete(item.id)}
                                className="text-destructive"
                              >
                                <Trash2 size={14} className="mr-2" /> Verwijderen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Afbeeldingen</CardTitle>
                <CardDescription>
                  Alleen afbeeldingen uit je media bibliotheek.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {sortedItems.filter(item => item.type.startsWith('image/')).length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      Geen afbeeldingen gevonden. Upload afbeeldingen om te beginnen.
                    </div>
                  ) : (
                    sortedItems
                      .filter(item => item.type.startsWith('image/'))
                      .map((item) => (
                        <div key={item.id} className="group relative rounded-lg overflow-hidden bg-secondary/20 border aspect-square">
                          <img 
                            src={item.url} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          
                          <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs truncate">{item.name}</p>
                          </div>
                          
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8">
                                  <MoreVertical size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs">Beheer media</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                  setPreviewItem(item);
                                  setShowPreview(true);
                                }}>
                                  <Eye size={14} className="mr-2" /> Bekijken
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCopyLink(item.url)}>
                                  <Copy size={14} className="mr-2" /> Kopieer URL
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = item.url;
                                  a.download = item.name;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                }}>
                                  <Download size={14} className="mr-2" /> Downloaden
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => setItemToDelete(item.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 size={14} className="mr-2" /> Verwijderen
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Dialog */}
      {previewItem && (
        <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex justify-between items-center">
                <span className="truncate">{previewItem.name}</span>
                <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
                  <X size={16} />
                </Button>
              </AlertDialogTitle>
            </AlertDialogHeader>
            
            <div className="my-4 flex justify-center">
              {previewItem.type.startsWith('image/') ? (
                <img 
                  src={previewItem.url} 
                  alt={previewItem.name}
                  className="max-h-[50vh] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <Image className="h-24 w-24 text-muted-foreground mb-4" />
                  <span className="text-lg font-medium">{previewItem.name}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 my-4">
              <div>
                <Label className="text-xs text-muted-foreground">Bestandsgrootte</Label>
                <p className="text-sm">{formatFileSize(previewItem.size)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Type</Label>
                <p className="text-sm">{previewItem.type}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Geüpload op</Label>
                <p className="text-sm">{formatDate(previewItem.uploadDate)}</p>
              </div>
            </div>
            
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => handleCopyLink(previewItem.url)}
              >
                <Copy size={16} className="mr-2" /> Kopieer URL
              </Button>
              <Button onClick={() => setShowPreview(false)}>
                Sluiten
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dit zal het mediabestand permanent verwijderen. Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && handleDeleteItem(itemToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 