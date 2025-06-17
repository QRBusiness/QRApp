import React from 'react';
import { Download, Printer, QrCode } from 'lucide-react';
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

interface PopUpQRCodeProps {
  children: React.ReactNode;
  open?: boolean;
  url?: string;
  openChange?: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const PopUpQRCode: React.FC<PopUpQRCodeProps> = ({ children, open, openChange, title, description, url }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
          <div
            className={`w-64 h-64 flex items-center justify-center border-2 ${false ? 'border' : 'border-dashed border'} rounded-lg mb-4`}
          >
            <img src={url} alt="QR Code URL" className="w-64 h-64 object-cover hidden" />
            {/* Replace with img here */}
            <div className="text-center p-4 flex flex-col items-center justify-center">
              <QrCode className="size-16 mb-2 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">{t('module.qrManagement.preview.position')}</p>
            </div>
          </div>
        </div>
        {/* Download Format */}
        {/* Action Buttons */}
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button className="w-full  whitespace-nowrap cursor-pointer col-span-2 md:col-span-1" disabled={false}>
            <Download className="mr-2" /> {t('module.qrManagement.preview.downloadButton')}
          </Button>
          <Button
            variant="outline"
            className="w-full  whitespace-nowrap cursor-pointer col-span-2 md:col-span-1"
            disabled={false}
          >
            <Printer className="mr-2" /> {t('module.qrManagement.preview.printButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default PopUpQRCode;
