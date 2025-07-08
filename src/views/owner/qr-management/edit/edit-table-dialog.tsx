import React from 'react';
import { useUpdateQRCode, useUpdateTable } from '@/services/owner/table-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, Table } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateTableSchema } from '@/utils/schemas';

interface MobileCreateDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  initialValues?: z.infer<typeof updateTableSchema>;
  id?: string; // Optional ID for the table being edited
}

const MobileCreateDialog: React.FC<MobileCreateDialogProps> = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  onCancel,
  initialValues,
  id,
}) => {
  const { t } = useTranslation();

  const { updateTable } = useUpdateTable();
  const { updateQRCode } = useUpdateQRCode();
  const form = useForm<z.infer<typeof updateTableSchema>>({
    resolver: zodResolver(updateTableSchema),
    values: initialValues,
  });

  const onSubmitForm = async (data: z.infer<typeof updateTableSchema>) => {
    await updateTable({
      id: id as string,
      data,
    });

    if (data.qr_code instanceof File) {
      await updateQRCode({
        id: id as string,
        qr_code: data.qr_code,
      });
    }
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogDescription>{t(description ?? '')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 w-full">
            {/* Branch Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.qrManagement.edit.fieldName.label')}
                    {updateTableSchema.shape.name.isOptional() ? '' : <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('module.qrManagement.edit.fieldName.placeholder')}
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>{t('module.qrManagement.edit.fieldName.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Area   */}
            <FormField
              control={form.control}
              name="qr_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.qrManagement.edit.fieldQrCode.label')}
                    {updateTableSchema.shape.qr_code.isOptional() ? '' : <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('module.qrManagement.placeholder')}
                      name={field.name}
                      ref={field.ref}
                      type="file"
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      onChange={(e) => field.onChange(e.target.files && e.target.files[0] ? e.target.files[0] : '')} // Assuming the QR code is a file input
                    />
                  </FormControl>
                  <FormDescription>{t('module.qrManagement.edit.fieldQrCode.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                <CircleX className="size-5 mr-[6px]" />
                {t('module.qrManagement.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <Table className="size-5 mr-[6px]" />
                {t('module.qrManagement.edit.button.save')}
              </Button>
            </DialogFooter>
            <div className="flex items-center justify-end space-x-2">{/* Reset and Submit buttons */}</div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MobileCreateDialog;
