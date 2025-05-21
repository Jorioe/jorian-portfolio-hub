import { z } from "zod";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useContactMessages } from "@/lib/ContactContext";
import emailjs from '@emailjs/browser';
import { v4 as uuidv4 } from 'uuid';

// Add CSS to ensure form labels stay black but error messages are red
import "./contact.css";

const formSchema = z.object({
  name: z.string().min(2, { message: "Naam moet minimaal 2 karakters zijn" }),
  email: z.string().email({ message: "Ongeldig e-mailadres" }),
  subject: z.string().min(5, { message: "Onderwerp moet minimaal 5 karakters zijn" }),
  message: z.string().min(10, { message: "Bericht moet minimaal 10 karakters zijn" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { addMessage } = useContactMessages();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setError(null);
    
    // EmailJS service IDs
    const serviceId = 'service_portfolio'; // Vervang met je eigen service ID
    const templateId = 'template_contact'; // Vervang met je eigen template ID
    const publicKey = 'public_key'; // Vervang met je eigen public key
    
    // Bereid de email template parameters voor
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message
    };

    // Voeg bericht toe aan de contactberichten
    const newMessage = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      date: new Date().toISOString(),
      isRead: false
    };
    
    // Stuur email met EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        // Voeg bericht toe aan de contactberichten database
        addMessage(newMessage);
        
        // Toon een success bericht
        toast.success("Bericht is succesvol verzonden!");
        form.reset();
      })
      .catch((err) => {
        console.error("Error:", err);
        
        // Probeer als backup via een mailto link
        try {
          const recipientEmail = "jorian.bracke@example.com"; // Vervang met je echte email
          const subject = `Website Contact: ${data.subject}`;
          const body = `
Naam: ${data.name}
Email: ${data.email}

Bericht:
${data.message}
          `;
          
          // Maak een mailto link en klik erop
          const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.location.href = mailtoLink;
          
          // Alsnog het bericht toevoegen aan berichten
          addMessage(newMessage);
          
          // Toon success message en reset form
          toast.success("Bericht wordt geopend in je email client!");
          form.reset();
        } catch (fallbackErr) {
          console.error("Fallback error:", fallbackErr);
          setError("Er is een fout opgetreden bij het verzenden van je bericht. Probeer het later nog eens.");
          toast.error("Fout bij het verzenden van bericht");
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-b from-secondary to-background py-20">
        <div className="container mx-auto px-4 text-center -mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Neem Contact Op
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Heb je een vraag of wil je samenwerken? Stuur me een bericht!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Stuur me een bericht</h2>
              <Form {...form}>
                <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="form-item">
                        <FormLabel className="form-label">Naam</FormLabel>
                        <FormControl>
                          <Input placeholder="Jouw naam" {...field} />
                        </FormControl>
                        <FormMessage className="form-error" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="form-item">
                        <FormLabel className="form-label">E-mailadres</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jouw@email.nl" {...field} />
                        </FormControl>
                        <FormMessage className="form-error" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="form-item">
                        <FormLabel className="form-label">Onderwerp</FormLabel>
                        <FormControl>
                          <Input placeholder="Onderwerp van je bericht" {...field} />
                        </FormControl>
                        <FormMessage className="form-error" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="form-item">
                        <FormLabel className="form-label">Bericht</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Typ je bericht hier..." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="form-error" />
                      </FormItem>
                    )}
                  />
                  
                  {error && (
                    <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verzenden...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Verzenden
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact informatie</h2>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">E-mail</h3>
                      <p className="text-muted-foreground">
                        <a 
                          href="mailto:jorian.bracke@example.com" 
                          className="hover:text-primary transition-colors"
                        >
                          jorian.bracke@example.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Telefoon</h3>
                      <p className="text-muted-foreground">
                        <a 
                          href="tel:+31612345678" 
                          className="hover:text-primary transition-colors"
                        >
                          +31 6 12345678
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Locatie</h3>
                      <p className="text-muted-foreground">
                        Amsterdam, Nederland
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Volg mij</h3>
                  <div className="flex space-x-4">
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="GitHub"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                      </svg>
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Twitter"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
