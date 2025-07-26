import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CustomConfirmDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const CustomConfirmDialog = ({
  title,
  description,
  onConfirm,
  onCancel,
  children,
  open,
  onOpenChange,
}: CustomConfirmDialogProps) => {
  const handleSubmit = () => {
    onConfirm && onConfirm();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel}>
            <X /> Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            <Check />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
      <DialogClose />
    </Dialog>
  );
};

export default CustomConfirmDialog;
