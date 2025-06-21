import React from 'react';
import { Eye } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import type { BusinessType } from '../table/columns';

interface ReadOnlyDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  children?: React.ReactNode;
  data: BusinessType;
}

const ReadOnlyDialog: React.FC<ReadOnlyDialogProps> = ({ isOpen, onClose, children, data }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-5" />
            {'Business Type Details'}
          </DialogTitle>
          <DialogDescription>{'You are viewing the details of this business type.'}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>ID:</Label> {data.id}
          </div>
          <div className="flex items-center gap-2">
            <Label>Name:</Label> {data.name}
          </div>
          <div className="flex items-center gap-2">
            <Label>Description:</Label> {data.description}
          </div>
          <div className="flex items-center gap-2">
            <Label>Created At:</Label> {data.created_at}
          </div>
          <div className="flex items-center gap-2">
            <Label>Last Updated At:</Label> {data.updated_at}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onClose(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReadOnlyDialog;
