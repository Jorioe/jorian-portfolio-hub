import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContactMessages, ContactMessage } from "@/lib/ContactContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Mail, Trash2, MoreVertical, Eye, Check } from "lucide-react";

export default function ContactMessages() {
  const { messages, markAsRead, deleteMessage, migrateToDatabase, reloadMessages } = useContactMessages();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Laad berichten bij eerste render
  useEffect(() => {
    reloadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sorteer berichten op datum, nieuwste eerst
  const sortedMessages = [...messages].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowViewDialog(true);
    
    // Markeer als gelezen wanneer bekeken
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  const handleDeleteMessage = (id: string) => {
    deleteMessage(id);
    setShowDeleteDialog(false);
    
    toast({
      title: "Bericht verwijderd",
      description: "Het bericht is succesvol verwijderd.",
    });
  };

  // Functie om datum te formatteren
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Functie om bericht te verkorten voor de tabel
  const truncateMessage = (message: string, maxLength = 30) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

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
            <h1 className="text-3xl font-bold">Contactberichten</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => migrateToDatabase()} 
              variant="outline"
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200"
            >
              Migreer naar Database
            </Button>
            <Button 
              onClick={() => reloadMessages()} 
              variant="outline"
              className="flex items-center gap-2"
            >
              Herlaad Berichten
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Ontvangen berichten</CardTitle>
            <CardDescription>
              Beheer berichten die via het contactformulier zijn binnengekomen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Datum</TableHead>
                    <TableHead>Afzender</TableHead>
                    <TableHead>Onderwerp</TableHead>
                    <TableHead>Bericht</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[80px]">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Geen berichten gevonden.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedMessages.map((message) => (
                      <TableRow 
                        key={message.id} 
                        className={`${message.isRead ? "" : "bg-secondary/20"} cursor-pointer hover:bg-secondary/30`}
                        onClick={() => handleViewMessage(message)}
                      >
                        <TableCell>{formatDate(message.date)}</TableCell>
                        <TableCell className="font-medium">
                          {message.name}
                          <div className="text-xs text-muted-foreground">
                            {message.email}
                          </div>
                        </TableCell>
                        <TableCell>{message.subject}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {truncateMessage(message.message)}
                        </TableCell>
                        <TableCell>
                          {message.isRead ? (
                            <Badge variant="outline" className="text-muted-foreground">Gelezen</Badge>
                          ) : (
                            <Badge>Nieuw</Badge>
                          )}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acties</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewMessage(message)}>
                                <Eye size={16} className="mr-2" /> Bekijken
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
                              }}>
                                <Mail size={16} className="mr-2" /> Beantwoorden
                              </DropdownMenuItem>
                              {!message.isRead && (
                                <DropdownMenuItem onClick={() => {
                                  markAsRead(message.id);
                                  toast({
                                    title: "Bericht gelezen",
                                    description: "Het bericht is gemarkeerd als gelezen."
                                  });
                                }}>
                                  <Check size={16} className="mr-2" /> Markeer als gelezen
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMessage(message);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 size={16} className="mr-2" /> Verwijderen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bericht bekijken dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              Van: {selectedMessage?.name} ({selectedMessage?.email})
              <br />
              Op: {selectedMessage && formatDate(selectedMessage.date)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-secondary/20 p-4 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {selectedMessage?.message}
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedMessage) {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                  }
                }}
              >
                <Mail size={16} className="mr-2" /> Beantwoorden
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowViewDialog(false);
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 size={16} className="mr-2" /> Verwijderen
              </Button>
            </div>
            <DialogClose asChild>
              <Button type="button">Sluiten</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verwijder bevestiging dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dit zal het bericht permanent verwijderen. Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMessage && handleDeleteMessage(selectedMessage.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 