import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CircleX } from 'lucide-react';
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
import { createBusinessTypeSchema } from '@/utils/schemas';

interface CreateNewBusinessTypeProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const CreateNewBusinessType = ({ children, open, onOpenChange, onSubmit, onCancel }: CreateNewBusinessTypeProps) => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof createBusinessTypeSchema>>({
    resolver: zodResolver(createBusinessTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
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

  const onSubmitForm = (data: z.infer<typeof createBusinessTypeSchema>) => {
    onSubmit && onSubmit();
    console.log('Business type submitted:', data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle>{t('module.menuManagement.createTitle')}</DialogTitle>
          <DialogDescription>{t('module.menuManagement.createDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.menuManagement.createMenuField.name')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.menuManagement.createMenuField.nameDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.menuManagement.createMenuField.description')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.menuManagement.createMenuField.descriptionDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.menuManagement.action.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <Building2 className="size-5 mr-[6px]" />
                {t('module.menuManagement.action.add')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewBusinessType;
