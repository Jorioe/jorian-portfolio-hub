import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ImagePlus, Upload, X, Link as LinkIcon, Eye } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MediaSelector } from './MediaSelector';

// Lokale opslag key voor de media bibliotheek
const MEDIA_STORAGE_KEY = 'portfolio_media_library';

interface ImageUploaderProps {
  defaultValue?: string;
  onImageUploaded: (url: string) => void;
}

// Globale cache voor afbeeldingen
const imageCache: Record<string, boolean> = {};

// Helper functie om afbeeldingen vooraf te laden
const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!src || src === '' || src.startsWith('data:')) {
      resolve(true);
      return;
    }

    // Als de afbeelding al in de cache zit, hoeven we deze niet opnieuw te laden
    if (imageCache[src]) {
      resolve(true);
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache[src] = true;
      resolve(true);
    };
    img.onerror = () => {
      resolve(false);
    };
    img.src = src;
  });
};

// Laad alle mediabibliotheek afbeeldingen vooraf in de cache
const preloadMediaLibraryImages = () => {
    try {
    const mediaItems = JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) || '[]');
    mediaItems.forEach((item: any) => {
      if (item.url && item.type && item.type.startsWith('image/')) {
        preloadImage(item.url);
      }
    });
  } catch (error) {
    console.error('Error preloading media library images:', error);
  }
};

// Roep dit aan bij het laden van de app
preloadMediaLibraryImages();

export function ImageUploader({ defaultValue = '', onImageUploaded }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [inputUrl, setInputUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voorlaad de afbeelding bij het initialiseren
  useEffect(() => {
    if (defaultValue) {
      setImageUrl(defaultValue);
      
      setIsPreloading(true);
      preloadImage(defaultValue).then((success) => {
        setIsPreloading(false);
        if (!success) {
          console.warn(`Kon afbeelding niet laden: ${defaultValue}`);
        }
      });
    } else {
      setIsPreloading(false);
    }
  }, [defaultValue]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
      
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageUrl(result);
      onImageUploaded(result);
      
      // Voeg toe aan media bibliotheek
      try {
        const mediaItems = JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) || '[]');
        const newMediaItem = {
          id: uuidv4(),
          name: file.name,
          url: result,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString()
        };
        
        mediaItems.push(newMediaItem);
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(mediaItems));
      } catch (error) {
        console.error('Error adding to media library:', error);
      }
      
      setIsUploading(false);
    };

    reader.onerror = () => {
      toast.error('Er is een fout opgetreden bij het uploaden.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!inputUrl) return;
    
    try {
      // Controleer of het een geldige URL is (basic controle)
      new URL(inputUrl);
      
      setIsPreloading(true);
      preloadImage(inputUrl).then((success) => {
        setIsPreloading(false);
        
        if (success) {
          setImageUrl(inputUrl);
          onImageUploaded(inputUrl);
          setInputUrl('');
          toast.success('Afbeelding URL toegevoegd');
        } else {
          toast.error('Kon de afbeelding niet laden. Controleer de URL.');
        }
      });
    } catch (error) {
      toast.error('Voer een geldige URL in');
    }
  };

  const clearImage = () => {
    setImageUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openMediaLibrary = () => {
    // Toon de media selector modal
    window.open('/dashboard/media', '_blank');
  };

  const handleImageSelected = (url: string) => {
    setImageUrl(url);
    onImageUploaded(url);
    setIsPreloading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <ImagePlus size={16} />
            {isUploading ? 'Uploading...' : 'Bestand kiezen'}
          </Button>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button 
            type="button" 
            variant="outline"
            onClick={openMediaLibrary}
          >
            Media bibliotheek
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowMediaSelector(true)}
          >
            Kies uit bibliotheek
          </Button>
        </div>
      </div>
      
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="imageUrl">Of voeg een URL toe</Label>
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        </div>
        <Button 
          type="button" 
          onClick={handleUrlSubmit}
          variant="secondary"
          className="flex items-center gap-2"
          disabled={isPreloading}
        >
          <LinkIcon size={16} />
          Toevoegen
        </Button>
      </div>
          
      {imageUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 truncate text-sm text-muted-foreground">
              {imageUrl.startsWith('data:') 
                ? 'Geüploade afbeelding' 
                : imageUrl}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="h-8 w-8 p-0"
              >
                <Eye size={16} />
                <span className="sr-only">Voorbeeld</span>
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={clearImage}
                className="h-8 w-8 p-0 text-destructive"
              >
                <X size={16} />
                <span className="sr-only">Verwijderen</span>
              </Button>
            </div>
              </div>
          
          {showPreview && (
            <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
              {isPreloading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </div>
              ) : (
                <img 
                  src={imageUrl} 
                  alt="Voorbeeld" 
                  className="w-full h-full object-contain"
                  onError={() => toast.error('Kon afbeelding niet laden')}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Media Selector */}
      <MediaSelector 
        open={showMediaSelector}
        onOpenChange={setShowMediaSelector}
        onSelect={handleImageSelected}
      />
    </div>
  );
} 