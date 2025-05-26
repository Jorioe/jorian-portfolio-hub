import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ImagePlus, Upload, X, Link as LinkIcon, Eye, FileVideo } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MediaSelector } from './MediaSelector';
import { mediaService } from '@/lib/database';

interface MediaUploaderProps {
  defaultValue?: string;
  onMediaUploaded: (url: string) => void;
  mediaType?: 'image' | 'video' | 'all';
  label?: string;
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
const preloadMediaLibraryImages = async () => {
  try {
    // Probeer afbeeldingen op te halen van Supabase
    const { data: mediaItems } = await mediaService.getMediaItems();
    
    if (mediaItems && mediaItems.length > 0) {
      mediaItems.forEach((item: any) => {
        if (item.url && item.type && item.type.startsWith('image/')) {
          preloadImage(item.url);
        }
      });
    }
  } catch (error) {
    console.error('Error preloading media library images:', error);
  }
};

// Roep dit aan bij het laden van de app
preloadMediaLibraryImages();

export function MediaUploader({ defaultValue = '', onMediaUploaded, mediaType = 'image', label = 'Bestand' }: MediaUploaderProps) {
  const [mediaUrl, setMediaUrl] = useState(defaultValue);
  const [inputUrl, setInputUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [mediaManagerMode, setMediaManagerMode] = useState<'select' | 'manage'>('select');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voorlaad de media bij het initialiseren
  useEffect(() => {
    if (defaultValue) {
      setMediaUrl(defaultValue);
      
      if (isImageUrl(defaultValue)) {
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
    } else {
      setIsPreloading(false);
    }
  }, [defaultValue]);

  // Controleer of een URL een afbeelding is
  const isImageUrl = (url: string) => {
    return (
      url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null ||
      url.startsWith('data:image/')
    );
  };

  // Controleer of een URL een video is
  const isVideoUrl = (url: string) => {
    return (
      url.match(/\.(mp4|webm|ogg|mov)$/i) !== null ||
      url.startsWith('data:video/') ||
      url.includes('youtube.com') ||
      url.includes('youtu.be')
    );
  };

  const getAcceptTypes = () => {
    if (mediaType === 'image') return 'image/*';
    if (mediaType === 'video') return 'video/*';
    return 'image/*,video/*';
  };

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
      // Upload het bestand naar Supabase via de mediaService
      const { data: mediaItem, error } = await mediaService.uploadFile(file);
      
      if (error) {
        toast.error('Er is een fout opgetreden bij het uploaden.');
        console.error('Upload error:', error);
        setIsUploading(false);
        return;
      }
      
      if (mediaItem) {
        setMediaUrl(mediaItem.url);
        onMediaUploaded(mediaItem.url);
        toast.success('Bestand succesvol geüpload');
      }
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast.error('Er is een fout opgetreden bij het uploaden.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!inputUrl) return;
    
    try {
      // Controleer of het een geldige URL is (basic controle)
      new URL(inputUrl);
      
      // Controleer of het mediatype overeenkomt met wat we willen
      const isImage = isImageUrl(inputUrl);
      const isVideo = isVideoUrl(inputUrl);

      if (mediaType === 'image' && !isImage) {
        toast.error('Voer een geldige afbeeldings-URL in.');
        return;
      }

      if (mediaType === 'video' && !isVideo) {
        toast.error('Voer een geldige video-URL in.');
        return;
      }
      
      if (isImage) {
        setIsPreloading(true);
        preloadImage(inputUrl).then((success) => {
          setIsPreloading(false);
          
          if (success) {
            setMediaUrl(inputUrl);
            onMediaUploaded(inputUrl);
            setInputUrl('');
            toast.success('Media URL toegevoegd');
          } else {
            toast.error('Kon de afbeelding niet laden. Controleer de URL.');
          }
        });
      } else {
        // Voor video's doen we geen preloading
        setMediaUrl(inputUrl);
        onMediaUploaded(inputUrl);
        setInputUrl('');
        toast.success('Media URL toegevoegd');
      }
    } catch (error) {
      toast.error('Voer een geldige URL in');
    }
  };

  const clearMedia = () => {
    setMediaUrl('');
    onMediaUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openMediaLibrary = () => {
    // Open de MediaSelector in manage mode
    setMediaManagerMode('manage');
    setShowMediaSelector(true);
  };

  const handleMediaSelected = (url: string) => {
    setMediaUrl(url);
    onMediaUploaded(url);
    setIsPreloading(false);
  };

  const renderPreview = () => {
    if (!mediaUrl) return null;

    if (isVideoUrl(mediaUrl)) {
      if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
        // Extract YouTube video ID
        let videoId = '';
        if (mediaUrl.includes('youtube.com/watch?v=')) {
          videoId = mediaUrl.split('v=')[1].split('&')[0];
        } else if (mediaUrl.includes('youtu.be/')) {
          videoId = mediaUrl.split('youtu.be/')[1].split('?')[0];
        }
        
        return (
          <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              title="YouTube video preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        );
      }
      
      return (
        <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
          <video 
            src={mediaUrl} 
            className="w-full h-full object-contain" 
            controls
          ></video>
        </div>
      );
    }
    
    return (
      <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
        {isPreloading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <img 
            src={mediaUrl} 
            alt="Voorbeeld" 
            className="w-full h-full object-contain"
            onError={() => toast.error('Kon afbeelding niet laden')}
          />
        )}
      </div>
    );
  };

  // Bepaal het juiste label voor de knoppen
  const fileTypeLabel = mediaType === 'image' ? 'afbeelding' : 
                        mediaType === 'video' ? 'video' : 'bestand';
  const fileIcon = mediaType === 'video' ? 
                  <FileVideo size={16} /> : 
                  <ImagePlus size={16} />;

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
            {fileIcon}
            {isUploading ? 'Uploading...' : `${label} kiezen`}
          </Button>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept={getAcceptTypes()}
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button 
            type="button" 
            variant="outline"
            onClick={openMediaLibrary}
          >
            Beheer media
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
          <Label htmlFor="mediaUrl">Of voeg een URL toe</Label>
          <Input
            id="mediaUrl"
            type="url"
            placeholder={`https://example.com/${fileTypeLabel}.${mediaType === 'video' ? 'mp4' : 'jpg'}`}
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
          
      {mediaUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 truncate text-sm text-muted-foreground">
              {mediaUrl.startsWith('data:') 
                ? `Geüpload ${fileTypeLabel}` 
                : mediaUrl}
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
                onClick={clearMedia}
                className="h-8 w-8 p-0 text-destructive"
              >
                <X size={16} />
                <span className="sr-only">Verwijderen</span>
              </Button>
            </div>
          </div>
          
          {showPreview && renderPreview()}
        </div>
      )}

      {/* Media Selector */}
      <MediaSelector 
        open={showMediaSelector}
        onOpenChange={setShowMediaSelector}
        onSelect={handleMediaSelected}
        mediaType={mediaType}
        mode={mediaManagerMode}
      />
    </div>
  );
}

// Voor achterwaartse compatibiliteit, stellen we ImageUploader gelijk aan MediaUploader
export const ImageUploader = MediaUploader; 