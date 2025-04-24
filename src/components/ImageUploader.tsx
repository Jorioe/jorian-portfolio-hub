import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { Upload, X, Image } from 'lucide-react';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  defaultValue?: string;
  label?: string;
}

export function ImageUploader({ onImageUploaded, defaultValue, label }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue || '');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Voor demo doeleinden, in een echte implementatie zou je Supabase Storage gebruiken
      // Hier simuleren we het uploaden en maken we een lokale URL
      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setProgress(percentage);
        }
      };
      
      reader.onload = () => {
        setTimeout(() => {
          // Simuleer een vertraging om het uploaden te tonen
          if (typeof reader.result === 'string') {
            // In een echte implementatie zou je hier de URL van de geüploade afbeelding krijgen
            // Voor nu gebruiken we een lokale URL als demonstratie
            const localImageUrl = reader.result;
            setImageUrl(localImageUrl);
            onImageUploaded(localImageUrl);
            setUploading(false);
          }
        }, 1000);
      };
      
      reader.onerror = () => {
        setError('Fout bij het lezen van het bestand');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
      
      // In een echte implementatie zou je dit gebruiken:
      /*
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error, data } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percentage);
          },
        });
        
      if (error) {
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      
      setImageUrl(publicUrl);
      onImageUploaded(publicUrl);
      */
    } catch (error: any) {
      setError(error.message || 'Er is een fout opgetreden bij het uploaden');
    } finally {
      setUploading(false);
    }
  }, [onImageUploaded]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Check bestandstype
      if (!file.type.startsWith('image/')) {
        setError('Alleen afbeeldingsbestanden zijn toegestaan');
        return;
      }
      
      // Check bestandsgrootte (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Afbeelding mag niet groter zijn dan 5MB');
        return;
      }
      
      uploadImage(file);
    }
  }, [uploadImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const handleManualUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onImageUploaded(url);
  };

  const clearImage = () => {
    setImageUrl('');
    onImageUploaded('');
  };

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      
      <div className="space-y-2">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="p-4 space-y-2">
              <div className="flex justify-center">
                <Upload className="h-10 w-10 text-muted-foreground animate-pulse" />
              </div>
              <div className="text-sm text-muted-foreground">Uploaden... {progress}%</div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : imageUrl ? (
            <div className="relative">
              <img 
                src={imageUrl} 
                alt="Geüploade afbeelding" 
                className="max-h-40 mx-auto object-contain"
                onError={() => setError('Kan de afbeelding niet laden')}
              />
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-0 right-0 h-6 w-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <div className="flex justify-center">
                <Image className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isDragActive ? 'Sleep de afbeelding hierheen...' : 'Sleep een afbeelding hierheen of klik om te selecteren'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF of WEBP (max. 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
        
        {error && <div className="text-sm text-destructive">{error}</div>}
        
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">Of voer een URL in:</div>
          <div className="flex gap-2">
            <Input 
              type="text" 
              value={imageUrl} 
              onChange={handleManualUrlChange}
              placeholder="https://example.com/image.jpg" 
              className="flex-1"
            />
            {imageUrl && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 