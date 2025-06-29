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
import { formattedDate } from '@/libs/utils';
import type { Menu } from '../tables/columns';

interface ReadOnlyDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  children?: React.ReactNode;
  data: Menu;
}

const ReadOnlyMenuItemDialog: React.FC<ReadOnlyDialogProps> = ({ isOpen, onClose, children, data }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onClose} key={data._id}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="size-5" />
            {t('module.menuManagement.viewTitle')}
          </DialogTitle>
          <DialogDescription>{t('module.menuManagement.viewDescription')}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center p-2 h-72 w-72 border border-dashed rounded-lg">
            <img src={data.image} alt="Image Menu Item" className="object-cover rounded-lg" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.id')}:</Label>
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
            <Label>{t('module.common.readOnlyDialog.category')}:</Label> {data.category.name || 'Category'}
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.subcategory')}:</Label> {data.subcategory.name || 'Subcategory'}
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.price')}:</Label> {data.variants[0]?.price || 0}
            {' VND'}
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

export default ReadOnlyMenuItemDialog;
