import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { contactInfoService } from './database';
import { toast } from 'sonner';

// Type definities
export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  icon?: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
};

// Context interface
interface ContactInfoContextType {
  contactInfo: ContactInfo;
  loading: boolean;
  updateContactInfo: (updatedInfo: ContactInfo) => void;
  reloadContactInfo: () => void;
  migrateToDatabase: () => Promise<boolean>;
}

// Standaard contactinformatie
const defaultContactInfo: ContactInfo = contactInfoService.defaultContactInfo;

// Context creëren
const ContactInfoContext = createContext<ContactInfoContextType | null>(null);

// Provider component
export function ContactInfoProvider({ children }: { children: ReactNode }) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState<boolean>(true);

  // Laad contactgegevens bij initialisatie
  useEffect(() => {
    loadContactInfo();
  }, []);

  // Functie om contactgegevens uit de database te laden
  const loadContactInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await contactInfoService.getContactInfo();
      
      if (error) {
        console.error('Error loading contact info:', error);
        setContactInfo(defaultContactInfo);
      } else if (data) {
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Unexpected error loading contact info:', error);
      setContactInfo(defaultContactInfo);
    } finally {
      setLoading(false);
    }
  };

  // Functie om contactgegevens bij te werken
  const updateContactInfo = async (updatedInfo: ContactInfo) => {
    try {
      // Update in database
      const { error } = await contactInfoService.updateContactInfo(updatedInfo);
      
      if (error) {
        console.error('Error updating contact info:', error);
        toast.error('Fout bij het opslaan van contactgegevens');
        return;
      }

      // Update state
      setContactInfo(updatedInfo);
      toast.success('Contactgegevens succesvol bijgewerkt');
    } catch (error) {
      console.error('Unexpected error updating contact info:', error);
      toast.error('Fout bij het bijwerken van contactgegevens');
    }
  };

  // Functie om gegevens opnieuw te laden
  const reloadContactInfo = () => {
    loadContactInfo();
    toast.success('Contactgegevens opnieuw geladen');
  };

  // Functie om gegevens naar de database te migreren (indien nodig)
  const migrateToDatabase = async (): Promise<boolean> => {
    try {
      const { success, error } = await contactInfoService.migrateFromLocalStorage();
      
      if (!success) {
        console.error('Error migrating contact info to database:', error);
        toast.error('Fout bij migratie naar database');
        return false;
      }
      
      // Herlaad data na migratie
      await loadContactInfo();
      toast.success('Contactgegevens succesvol gemigreerd naar database');
      return true;
    } catch (error) {
      console.error('Unexpected error during migration:', error);
      toast.error('Onverwachte fout bij migratie');
      return false;
    }
  };

  // Context waarde
  const value = {
    contactInfo,
    loading,
    updateContactInfo,
    reloadContactInfo,
    migrateToDatabase
  };

  return (
    <ContactInfoContext.Provider value={value}>
      {children}
    </ContactInfoContext.Provider>
  );
}

// Hook om de context te gebruiken
export function useContactInfo() {
  const context = useContext(ContactInfoContext);
  
  if (!context) {
    throw new Error('useContactInfo moet binnen een ContactInfoProvider gebruikt worden');
  }
  
  return context;
} 