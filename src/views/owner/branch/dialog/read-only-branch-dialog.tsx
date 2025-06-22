import React from 'react';
import { Copy, Eye } from 'lucide-react';
import { Hint } from '@/components/common/hint';
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
import { formattedDate } from '@/libs/utils';
import type { BranchType } from '../table/columns';

interface ReadOnlyDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  children?: React.ReactNode;
  data: BranchType;
}

const ReadOnlyDialog: React.FC<ReadOnlyDialogProps> = ({ isOpen, onClose, children, data }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-5" />
            {'Branch Type Details'}
          </DialogTitle>
          <DialogDescription>{'You are viewing the details of this branch type.'}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>ID:</Label>{' '}
            <div className="flex gap-2 items-center">
              {data.id}
              <Hint label="Copy ID" side="right">
                <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(data.id)}>
                  <Copy className="size-4" />
                </Button>
              </Hint>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Branch Name:</Label> {data.name}
          </div>
          <div className="flex items-center justify-between">
            <Label>Address:</Label> {data.address}
          </div>
          <div className="flex items-center justify-between">
            <Label>Contact Number:</Label> {data.contact}
          </div>
          <div className="flex items-center justify-between">
            <Label>Created At:</Label> <p>{formattedDate(data.created_at)}</p>
          </div>
          <div className="flex items-center justify-between">
            <Label>Last Updated At:</Label> {formattedDate(data.updated_at)}
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
