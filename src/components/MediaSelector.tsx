import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Image, Video, Upload, Trash2, RefreshCw } from "lucide-react";
import { mediaService } from "@/lib/database";
import { toast } from "sonner";

// Type voor media items
interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: string;
}

interface MediaSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  mediaType?: 'image' | 'video' | 'all';
  mode?: 'select' | 'manage';
}

export function MediaSelector({ open, onOpenChange, onSelect, mediaType = 'image', mode = 'select' }: MediaSelectorProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Laad media items bij openen
  useEffect(() => {
    if (open) {
      loadMediaItems();
    }
  }, [open]);

  // Haal media items op uit Supabase
  const loadMediaItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await mediaService.getMediaItems();
      
      if (error) {
        console.error('Error loading media items:', error);
        setMediaItems([]);
      } else if (data) {
        setMediaItems(data);
      } else {
        setMediaItems([]);
      }
    } catch (error) {
      console.error('Error loading media items:', error);
      setMediaItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload een bestand
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Controleer of het bestandstype overeenkomt met het gewenste mediaType
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (mediaType === 'image' && !isImage) {
      toast.error('Selecteer alstublieft een afbeeldingsbestand.');
      return;
    }

    if (mediaType === 'video' && !isVideo) {
      toast.error('Selecteer alstublieft een videobestand.');
      return;
    }

    setIsUploading(true);
    
    try {
      const { data: mediaItem, error } = await mediaService.uploadFile(file);
      
      if (error) {
        toast.error('Er is een fout opgetreden bij het uploaden.');
        console.error('Upload error:', error);
        return;
      }
      
      if (mediaItem) {
        // Voeg het nieuwe item toe aan de lijst
        setMediaItems(prev => [mediaItem, ...prev]);
        toast.success('Bestand succesvol geüpload');
      }
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast.error('Er is een fout opgetreden bij het uploaden.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Verwijder een item
  const handleDeleteItem = async (item: MediaItem) => {
    if (!confirm(`Weet je zeker dat je "${item.name}" wilt verwijderen?`)) {
      return;
    }

    try {
      // Haal filename uit url
      let filename = item.url;
      if (filename.includes('/')) {
        filename = filename.split('/').pop() || '';
      }

      const { error } = await mediaService.deleteFile(filename);
      
      if (error) {
        toast.error('Er is een fout opgetreden bij het verwijderen.');
        console.error('Delete error:', error);
        return;
      }
      
      // Verwijder item uit de lijst
      setMediaItems(prev => prev.filter(i => i.id !== item.id));
      toast.success('Bestand succesvol verwijderd');
    } catch (error) {
      console.error('Error in handleDeleteItem:', error);
      toast.error('Er is een fout opgetreden bij het verwijderen.');
    }
  };

  // Filter op basis van mediaType
  const filterByMediaType = (item: MediaItem) => {
    if (mediaType === 'all') return true;
    if (mediaType === 'image') return item.type.startsWith('image/');
    if (mediaType === 'video') return item.type.startsWith('video/') || 
                                     item.url.includes('youtube.com') || 
                                     item.url.includes('youtu.be');
    return true;
  };

  // Gefilterde en gesorteerde items
  const filteredItems = mediaItems
    .filter(item => 
      filterByMediaType(item) && 
      (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  // Selecteer een media item
  const handleSelect = (url: string) => {
    if (mode === 'select') {
      onSelect(url);
      onOpenChange(false);
    } else {
      // In manage mode, selecteer het item voor verwijderen
      setSelectedItem(selectedItem === url ? null : url);
    }
  };

  // Bepaal wat het juiste preview component is
  const renderPreview = (item: MediaItem) => {
    if (item.type.startsWith('video/') || item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
      return (
        <div className="flex items-center justify-center h-full w-full bg-black/10">
          <Video className="h-10 w-10 text-muted-foreground" />
        </div>
      );
    }
    
    return (
      <img 
        src={item.url} 
        alt={item.name}
        className="w-full h-full object-cover"
      />
    );
  };

  const mediaTypeTitle = mediaType === 'image' ? 'afbeelding' : 
                         mediaType === 'video' ? 'video' : 'media';

  const getAcceptTypes = () => {
    if (mediaType === 'image') return 'image/*';
    if (mediaType === 'video') return 'video/*';
    return 'image/*,video/*';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === 'select' 
              ? `Kies een ${mediaTypeTitle}` 
              : `Beheer mediabibliotheek`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'select' 
              ? `Selecteer een ${mediaTypeTitle} uit de mediabibliotheek`
              : `Voeg nieuwe media toe of verwijder bestaande items`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Zoek ${mediaTypeTitle}s...`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {mode === 'manage' && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Upload size={16} />
                {isUploading ? 'Uploading...' : 'Upload bestand'}
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept={getAcceptTypes()}
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button 
                variant="outline" 
                onClick={loadMediaItems}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                <span className="sr-only">Vernieuwen</span>
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-1 px-1 overflow-y-auto h-[calc(80vh-200px)] min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchQuery ? 'Geen resultaten gevonden' : `Geen ${mediaTypeTitle}s in de mediabibliotheek`}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-2 overflow-y-auto">
              {filteredItems.map((item) => (
                <div key={item.id} className="relative">
                  <Button
                    variant="outline"
                    className={`p-0 h-auto aspect-square overflow-hidden relative group w-full ${selectedItem === item.url ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleSelect(item.url)}
                  >
                    {renderPreview(item)}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-xs text-center p-2 truncate">{item.name}</p>
                    </div>
                  </Button>
                  
                  {mode === 'manage' && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4">
          {mode === 'manage' && selectedItem && (
            <Button onClick={() => onSelect(selectedItem)}>
              Selecteer item
            </Button>
          )}
          
          <div className="ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {mode === 'select' ? 'Annuleren' : 'Sluiten'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 