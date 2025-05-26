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
import { toast } from 'sonner';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import { useContactInfo, SocialLink } from '@/lib/ContactInfoContext';
import { v4 as uuidv4 } from 'uuid';

export default function ContactInfoEditor() {
  const navigate = useNavigate();
  const { contactInfo, loading, updateContactInfo, reloadContactInfo, migrateToDatabase } = useContactInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [editableInfo, setEditableInfo] = useState({
    email: '',
    phone: '',
    location: '',
    socialLinks: [] as SocialLink[]
  });

  // Laad de huidige contactgegevens wanneer de context is geladen
  useEffect(() => {
    if (!loading) {
      setEditableInfo(contactInfo);
    }
  }, [contactInfo, loading]);

  // Update een veld in de contactinfo
  const handleInputChange = (field: 'email' | 'phone' | 'location', value: string) => {
    setEditableInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Voeg een nieuwe social link toe
  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: uuidv4(),
      platform: 'Nieuw Platform',
      url: 'https://',
      icon: 'link'
    };
    
    setEditableInfo((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));
  };

  // Verwijder een social link
  const removeSocialLink = (id: string) => {
    setEditableInfo((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  // Update een social link
  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    setEditableInfo((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  };

  // Opslaan van de contactgegevens
  const handleSave = async () => {
    setIsLoading(true);

    try {
      await updateContactInfo(editableInfo);
      
      // Navigeer terug naar dashboard na opslaan
      setTimeout(() => {
        navigate('/dashboard');
      }, 500); // Korte timeout zodat de gebruiker de toast kan zien
    } catch (error) {
      toast.error('Fout bij opslaan van contactgegevens');
    } finally {
      setIsLoading(false);
    }
  };

  // Migreer naar database
  const handleMigrateToDatabase = async () => {
    setIsLoading(true);
    await migrateToDatabase();
    setIsLoading(false);
  };

  // Herlaad contactgegevens
  const handleReload = () => {
    reloadContactInfo();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Contactgegevens laden...</p>
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
            <h1 className="text-3xl font-bold">Contactgegevens Bewerken</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleMigrateToDatabase} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200"
            >
              Migreer naar Database
            </Button>
            <Button 
              onClick={handleReload} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              Herlaad Gegevens
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

        {/* Contactgegevens */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Contact Informatie</CardTitle>
            <CardDescription>
              Deze gegevens worden weergegeven op de contactpagina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                value={editableInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
                placeholder="jouw@email.nl"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefoonnummer</Label>
              <Input
                id="phone"
                value={editableInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1"
                placeholder="+31 6 12345678"
              />
            </div>
            <div>
              <Label htmlFor="location">Locatie</Label>
              <Input
                id="location"
                value={editableInfo.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1"
                placeholder="Amsterdam, Nederland"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Social Media Links</CardTitle>
            <CardDescription>
              Links naar je social media profielen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {editableInfo.socialLinks.map((link, index) => (
                <div key={link.id} className="border rounded-md p-4 space-y-3">
                  <div>
                    <Label htmlFor={`platform-${index}`}>Platform</Label>
                    <Input
                      id={`platform-${index}`}
                      value={link.platform}
                      onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                      className="mt-1"
                      placeholder="LinkedIn, GitHub, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor={`url-${index}`}>URL</Label>
                    <Input
                      id={`url-${index}`}
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                      className="mt-1"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`icon-${index}`}>Icon (optioneel)</Label>
                    <Input
                      id={`icon-${index}`}
                      value={link.icon || ''}
                      onChange={(e) => updateSocialLink(link.id, 'icon', e.target.value)}
                      className="mt-1"
                      placeholder="github, linkedin, twitter, etc."
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSocialLink(link.id)}
                  >
                    <Trash2 size={16} className="mr-2" /> Verwijderen
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addSocialLink}
                className="flex items-center gap-2"
              >
                <Plus size={16} /> Nieuwe Social Link
              </Button>
            </div>
          </CardContent>
        </Card>

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