import React from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface MobileCreateDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const MobileCreateDialog: React.FC<MobileCreateDialogProps> = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogDescription>{t(description ?? '')}</DialogDescription>
        </DialogHeader>
        <form
          id="newTableForm"
          className="space-y-4 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const tableName = formData.get('tableName') as string;
            const area = formData.get('area') as string;
            const status = formData.get('status') as string;
            const available = formData.get('available') === 'on';

            if (!tableName || !area || !status) {
              return;
            }

            // Handle form submission here
            console.log({ tableName, area, status, available });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input id="tableName" name="tableName" placeholder="Enter table name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Area</Label>
            <Input id="area" name="area" placeholder="Enter area" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" required defaultValue="active">
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="available">Available</Label>
            <Switch id="available" name="available" />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" className="!rounded-button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="newTableForm"
            className="!rounded-button bg-blue-600 hover:bg-blue-700"
            onClick={onSubmit}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MobileCreateDialog;
