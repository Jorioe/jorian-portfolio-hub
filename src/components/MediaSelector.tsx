import { useState, useEffect } from "react";
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
import { Search, Image } from "lucide-react";

// Lokale opslag key voor de media bibliotheek
const MEDIA_STORAGE_KEY = 'portfolio_media_library';

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
}

export function MediaSelector({ open, onOpenChange, onSelect }: MediaSelectorProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Laad media items bij openen
  useEffect(() => {
    if (open) {
      loadMediaItems();
    }
  }, [open]);

  // Haal media items op uit localStorage
  const loadMediaItems = () => {
    setIsLoading(true);
    try {
      const storedItems = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (storedItems) {
        const items = JSON.parse(storedItems);
        setMediaItems(items);
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

  // Gefilterde en gesorteerde items
  const filteredItems = mediaItems
    .filter(item => 
      item.type.startsWith('image/') && 
      (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  // Selecteer een afbeelding
  const handleSelect = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Kies een afbeelding</DialogTitle>
          <DialogDescription>
            Selecteer een afbeelding uit de mediabibliotheek
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek afbeeldingen..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ScrollArea className="flex-1 px-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchQuery ? 'Geen resultaten gevonden' : 'Geen afbeeldingen in de mediabibliotheek'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-2">
              {filteredItems.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="p-0 h-auto aspect-square overflow-hidden relative group"
                  onClick={() => handleSelect(item.url)}
                >
                  <img 
                    src={item.url} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs text-center p-2 truncate">{item.name}</p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 