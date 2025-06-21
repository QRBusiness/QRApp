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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { formattedDate } from '@/libs/utils';
import type { BusinessType } from '../table/columns';

interface ReadOnlyDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  children?: React.ReactNode;
  data: BusinessType;
}

const ReadOnlyBusinessDialog: React.FC<ReadOnlyDialogProps> = ({ isOpen, onClose, children, data }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-5" />
            {'Business Details'}
          </DialogTitle>
          <DialogDescription>{'You are viewing the details of this business type.'}</DialogDescription>
        </DialogHeader>
        <Separator />

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
          {
            <div className="flex items-center justify-between">
              <Label>Available:</Label>
              <Switch checked={data.available} disabled />
            </div>
          }
          <div className="flex items-center justify-between">
            <Label>Name:</Label> {data.name}
          </div>
          <div className="flex items-center justify-between">
            <Label>Address:</Label> {data.address}
          </div>
          <div className="flex items-center justify-between">
            <Label>Contact:</Label> {data.contact}
          </div>
          <div className="flex items-center justify-between">
            <Label>Business Type:</Label> {data.business_type}
          </div>
          <div className="flex items-center justify-between">
            <Label>Business Tax Code:</Label> {data.tax_code}
          </div>
          <div className="flex items-center justify-between">
            <Label>Created At:</Label> <p>{formattedDate(data.created_at)}</p>
          </div>
          <div className="flex items-center justify-between">
            <Label>Last Updated At:</Label> <p>{formattedDate(data.updated_at)}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onClose(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReadOnlyBusinessDialog;
