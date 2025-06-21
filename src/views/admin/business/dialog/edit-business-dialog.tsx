import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, CircleX, UserRoundPen } from 'lucide-react';
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
import { createBusinessSchema } from '@/utils/schemas';

interface EditBusinessDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  initialData?: z.infer<typeof createBusinessSchema>;
}

const EditBusinessDialog = ({
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  initialData,
}: EditBusinessDialogProps) => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof createBusinessSchema>>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const onCancelHandler = () => {
    onCancel && onCancel();
    onOpenChange(false);
  };

  const onSubmitForm = (data: z.infer<typeof createBusinessSchema>) => {
    onSubmit && onSubmit();
    console.log('Business submitted:', data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRoundPen /> {t('module.createBusinessOwnerField.step3.title')}
          </DialogTitle>
          <DialogDescription>{t('module.createBusinessOwnerField.step3.description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.createBusinessOwnerField.step3.name.label')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.createBusinessOwnerField.step3.name.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.createBusinessOwnerField.step3.address.label')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.createBusinessOwnerField.step3.address.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.createBusinessOwnerField.step3.contact.label')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.createBusinessOwnerField.step3.contact.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.createBusinessOwnerField.step3.businessType.label')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('module.createBusinessOwnerField.step3.businessType.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessTaxCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.createBusinessOwnerField.step3.businessTaxCode.label')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('module.createBusinessOwnerField.step3.businessTaxCode.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.createBusinessOwnerField.step3.button.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <CircleCheck className="size-5 mr-[6px]" />
                {t('module.createBusinessOwnerField.step3.button.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBusinessDialog;
