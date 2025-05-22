import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { contactService } from './database';
import { useToast } from '@/components/ui/use-toast';

// Definieer het type voor een contactbericht
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

// Definieer het type voor de context
interface ContactContextType {
  messages: ContactMessage[];
  loading: boolean;
  addMessage: (message: ContactMessage) => void;
  markAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  getUnreadCount: () => number;
  migrateToDatabase: () => Promise<void>;
  reloadMessages: () => Promise<void>;
}

// Lokale opslag key
const STORAGE_KEY = 'portfolio_contact_messages';

// Creëer de context met een default waarde
const ContactContext = createContext<ContactContextType>({
  messages: [],
  loading: true,
  addMessage: () => {},
  markAsRead: () => {},
  deleteMessage: () => {},
  getUnreadCount: () => 0,
  migrateToDatabase: async () => {},
  reloadMessages: async () => {}
});

// Hook om de context te gebruiken
export const useContactMessages = () => useContext(ContactContext);

// Helper om berichten op te halen uit lokale opslag
const getStoredMessages = (): ContactMessage[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error loading messages from localStorage:', error);
  }
  return [];
};

// Helper om berichten op te slaan in lokale opslag
const storeMessages = (messages: ContactMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error storing messages in localStorage:', error);
  }
};

// Provider component
export const ContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Laad berichten bij initialisatie
  useEffect(() => {
    loadMessagesFromDatabase();
  }, []);

  // Functie om berichten uit database te laden
  const loadMessagesFromDatabase = async () => {
    setLoading(true);
    try {
      console.log('Loading contact messages from database...');
      const { data, error } = await contactService.getMessages();
      
      if (error) {
        console.error('Error loading messages from database:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // Fallback naar localStorage
        loadFromLocalStorage();
      } else if (data && data.length > 0) {
        console.log('Messages loaded from database:', data.length);
        setMessages(data);
      } else {
        console.log('No messages in database, loading from localStorage');
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load messages from database:', error);
      
      // Fallback naar localStorage
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Functie om berichten uit localStorage te laden als fallback
  const loadFromLocalStorage = () => {
    try {
      const loadedMessages = getStoredMessages();
      setMessages(loadedMessages);
      console.log('Messages loaded from localStorage:', loadedMessages.length);
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error);
      setMessages([]);
    }
  };

  // Functie om een nieuw bericht toe te voegen
  const addMessage = async (message: ContactMessage) => {
    setLoading(true);
    
    try {
      // Eerst toevoegen aan de database
      const { data, error } = await contactService.addMessage(message);
      
      if (error) {
        console.error('Error adding message to database:', error);
        toast({
          title: 'Fout bij opslaan',
          description: 'Kon bericht niet opslaan in de database. Opgeslagen in localStorage als fallback.',
          variant: 'destructive',
        });
        
        // Fallback naar localStorage
        const updatedMessages = [...messages, message];
        setMessages(updatedMessages);
        storeMessages(updatedMessages);
      } else {
        console.log('Message added to database:', data);
        
        // Gebruik het nieuwe bericht van de database (met eventuele server-side wijzigingen)
        const newMessage = data[0] || message;
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        
        toast({
          title: 'Bericht verzonden',
          description: 'Je bericht is succesvol verzonden.',
        });
      }
    } catch (error) {
      console.error('Error saving message:', error);
      
      // Fallback naar localStorage
      try {
        const updatedMessages = [...messages, message];
        setMessages(updatedMessages);
        storeMessages(updatedMessages);
        
        toast({
          title: 'Bericht opgeslagen',
          description: 'Je bericht kon niet worden verzonden naar de server, maar is lokaal opgeslagen.',
          variant: 'destructive',
        });
      } catch (localStorageError) {
        console.error('Error storing in localStorage:', localStorageError);
        
        toast({
          title: 'Fout bij opslaan',
          description: 'Kon het bericht niet opslaan. Probeer het later opnieuw.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Functie om een bericht als gelezen te markeren
  const markAsRead = async (id: string) => {
    try {
      // Update in de database
      const { error } = await contactService.markAsRead(id);
      
      if (error) {
        console.error('Error marking message as read in database:', error);
        // Fallback: alleen lokaal updaten
      }
      
      // Update lokale state
      const updatedMessages = messages.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      );
      
      setMessages(updatedMessages);
      
      // Ook updaten in localStorage als fallback
      storeMessages(updatedMessages);
      
      console.log('Bericht als gelezen gemarkeerd:', id);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Functie om een bericht te verwijderen
  const deleteMessage = async (id: string) => {
    try {
      // Verwijder uit de database
      const { error } = await contactService.deleteMessage(id);
      
      if (error) {
        console.error('Error deleting message from database:', error);
        toast({
          title: 'Fout bij verwijderen',
          description: 'Kon bericht niet verwijderen uit de database.',
          variant: 'destructive',
        });
      }
      
      // Update lokale state
      const updatedMessages = messages.filter(msg => msg.id !== id);
      setMessages(updatedMessages);
      
      // Ook updaten in localStorage als fallback
      storeMessages(updatedMessages);
      
      console.log('Bericht verwijderd:', id);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Functie om het aantal ongelezen berichten te krijgen
  const getUnreadCount = () => {
    return messages.filter(msg => !msg.isRead).length;
  };

  // Functie voor migratie van localStorage naar database
  const migrateToDatabase = async () => {
    setLoading(true);
    
    try {
      console.log('Migrating contact messages from localStorage to database');
      const { success, error } = await contactService.migrateFromLocalStorage();
      
      if (!success) {
        console.error('Error migrating messages to database:', error);
        toast({
          title: 'Fout bij migratie',
          description: 'Kon berichten niet migreren naar de database.',
          variant: 'destructive',
        });
      } else {
        console.log('Contact messages successfully migrated to database');
        toast({
          title: 'Migratie voltooid',
          description: 'De contactberichten zijn succesvol gemigreerd naar de database.',
        });
        
        // Herlaad de berichten uit de database
        await loadMessagesFromDatabase();
        
        // Verwijder lokale opslag na succesvolle migratie
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to migrate messages to database:', error);
      toast({
        title: 'Fout bij migratie',
        description: 'Er is een onverwachte fout opgetreden bij de migratie.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Functie om berichten opnieuw te laden
  const reloadMessages = async () => {
    try {
      await loadMessagesFromDatabase();
      toast({
        title: 'Berichten herladen',
        description: 'De contactberichten zijn opnieuw geladen uit de database.',
      });
    } catch (error) {
      console.error('Error reloading messages:', error);
      toast({
        title: 'Fout bij herladen',
        description: 'Kon de contactberichten niet opnieuw laden.',
        variant: 'destructive',
      });
    }
  };

  return (
    <ContactContext.Provider value={{ 
      messages, 
      loading, 
      addMessage,
      markAsRead,
      deleteMessage,
      getUnreadCount,
      migrateToDatabase,
      reloadMessages
    }}>
      {children}
    </ContactContext.Provider>
  );
}; 