import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Laad berichten bij initialisatie
  useEffect(() => {
    try {
      const loadedMessages = getStoredMessages();
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Functie om een nieuw bericht toe te voegen
  const addMessage = (message: ContactMessage) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    storeMessages(updatedMessages);
    console.log('Bericht toegevoegd:', message);
  };

  // Functie om een bericht als gelezen te markeren
  const markAsRead = (id: string) => {
    const updatedMessages = messages.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    );
    setMessages(updatedMessages);
    storeMessages(updatedMessages);
    console.log('Bericht als gelezen gemarkeerd:', id);
  };

  // Functie om een bericht te verwijderen
  const deleteMessage = (id: string) => {
    const updatedMessages = messages.filter(msg => msg.id !== id);
    setMessages(updatedMessages);
    storeMessages(updatedMessages);
    console.log('Bericht verwijderd:', id);
  };

  // Functie om het aantal ongelezen berichten te krijgen
  const getUnreadCount = () => {
    return messages.filter(msg => !msg.isRead).length;
  };

  return (
    <ContactContext.Provider value={{ 
      messages, 
      loading, 
      addMessage,
      markAsRead,
      deleteMessage,
      getUnreadCount
    }}>
      {children}
    </ContactContext.Provider>
  );
}; 