import React from 'react';
import { CircleX, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
} from '@/components/ui/alert-dialog';

interface CustomAlertDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  onSubmit?: () => void;
  buttonSubmitLabel?: string;
  onCancel?: () => void;
}

export const CustomAlertDialog = ({
  children,
  title,
  description,
  onSubmit,
  buttonSubmitLabel,
}: CustomAlertDialogProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = () => {
    setOpen(false);
    onSubmit && onSubmit();
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || 'Are you sure you want to proceed with this action?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <CircleX className="text-xs md:text-sm mr-2" />
            {t('module.qrManagement.alertDialog.cancelButton')}
          </AlertDialogCancel>
          <AlertDialogAction
            className=" bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            onClick={handleSubmit}
          >
            <Trash className="text-xs md:text-xs mr-2" />
            {buttonSubmitLabel || t('module.qrManagement.alertDialog.confirmButton')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
