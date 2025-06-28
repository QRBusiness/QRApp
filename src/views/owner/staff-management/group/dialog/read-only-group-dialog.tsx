import React from 'react';
import { Copy, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { formattedDate } from '@/libs/utils';

export interface GroupProps {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ReadOnlyDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  children?: React.ReactNode;
  data: GroupProps;
}

const ReadOnlyGroupDialog: React.FC<ReadOnlyDialogProps> = ({ isOpen, onClose, children, data }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="size-5" />
            {t('module.groupManagement.viewTitle')}
          </DialogTitle>
          <DialogDescription>{t('module.groupManagement.viewDescription')}</DialogDescription>
        </DialogHeader>
        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.id')}:</Label>{' '}
            <div className="flex gap-2 items-center">
              {data._id}
              <Hint label={t('module.common.readOnlyDialog.copyId')} side="right">
                <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(data._id)}>
                  <Copy className="size-4" />
                </Button>
              </Hint>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.name')}:</Label> {data.name}
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.description')}:</Label> {data.description}
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.createdAt')}:</Label>
            <p>{formattedDate(data.created_at)}</p>
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.updatedAt')}:</Label>
            <p>{formattedDate(data.updated_at)}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onClose(false)}>{t('module.common.readOnlyDialog.button')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReadOnlyGroupDialog;
