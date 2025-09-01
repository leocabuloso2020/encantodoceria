import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { useSweetNote } from "@/hooks/use-sweet-note";
// import { Skeleton } from "@/components/ui/skeleton"; // Removido: não utilizado

const LOCAL_STORAGE_KEY = "sweet-note-dismissed-date";

const SweetNotePopup = () => {
  const { data: sweetNote, isLoading, isError } = useSweetNote();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isError && sweetNote && sweetNote.is_active) {
      const dismissedDate = localStorage.getItem(LOCAL_STORAGE_KEY);
      const today = new Date().toDateString();

      if (!dismissedDate || dismissedDate !== today) {
        setIsOpen(true);
      }
    }
  }, [sweetNote, isLoading, isError]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toDateString());
  };

  if (isLoading) {
    return null;
  }

  if (isError || !sweetNote || !sweetNote.is_active) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] p-6 bg-gradient-to-br from-card to-accent-soft border-primary/30 shadow-xl rounded-2xl animate-bounce-in">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-primary animate-pulse" fill="currentColor" />
          </div>
          <DialogTitle className="font-dancing text-3xl font-bold gradient-text mb-2">
            Um Bilhetinho Doce para Você!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base leading-relaxed">
            {sweetNote.content}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleClose} 
            className="pix-button bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            <X className="h-4 w-4 mr-2" />
            Entendi!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SweetNotePopup;