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
  create?: boolean;
  initialData?: z.infer<typeof createBusinessTypeSchema>;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof createBusinessTypeSchema>) => void;
  onCancel?: () => void;
}

const CreateNewBusinessType = ({
  create = true,
  initialData = { name: '', description: '' },
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: CreateNewBusinessTypeProps) => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof createBusinessTypeSchema>>({
    resolver: zodResolver(createBusinessTypeSchema),
    defaultValues: initialData,
  });

  // Reset form values whenever dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      form.reset(initialData);
    }
  }, [open, initialData, form]);

  const onCancelHandler = () => {
    onCancel && onCancel();
    onOpenChange(false);
  };

  const onSubmitForm = (data: z.infer<typeof createBusinessTypeSchema>) => {
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle>
            {create ? t('module.businessType.createTitle') : t('module.businessType.editTitle')}{' '}
          </DialogTitle>
          <DialogDescription>
            {create ? t('module.businessType.createDescription') : t('module.businessType.editDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-6 w-full"
            key={open ? JSON.stringify(initialData) : 'closed'}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.businessType.createField.name')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.businessType.createField.nameDescription')}</FormDescription>
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
                    {t('module.businessType.createField.description')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.businessType.createField.descriptionDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="destructive" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.businessType.action.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <Building2 className="size-5 mr-[6px]" />
                {create ? t('module.businessType.action.create') : t('module.businessType.action.edit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewBusinessType;
