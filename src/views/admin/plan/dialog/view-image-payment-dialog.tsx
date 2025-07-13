import React from 'react';
import { Package, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ImagePopUpProps {
  children: React.ReactNode;
  open?: boolean;
  url?: string;
  openChange?: (open: boolean) => void;
  title: string;
  description?: string;
}

const ImagePopUp: React.FC<ImagePopUpProps> = ({ children, open, openChange, title, description, url }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package />
            <p>{title}</p>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
          <div
            className={`w-full min-w-[350px] min-h-[350px] h-fit max-h-96 flex items-center justify-center border-2 ${false ? 'border' : 'border-dashed border'} rounded-lg mb-4`}
          >
            <ScrollArea className="w-full h-full p-1">
              <img
                src={url}
                alt="Image"
                className="flex-1 object-cover w-full min-w-[350px] min-h-[350px] h-fit max-h-96 overflow-y-scroll"
              />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </div>
        {/* Download Format */}
        {/* Action Buttons */}
        <DialogFooter className="grid grid-cols-1 gap-2">
          <Button className="w-full  whitespace-nowrap cursor-pointer col-span-2 md:col-span-1">
            <X className="mr-2" /> {t('module.qrManagement.preview.downloadButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ImagePopUp;
