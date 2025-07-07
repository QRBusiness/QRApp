import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, UtensilsCrossed } from 'lucide-react';
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
import { createCategoriesSchema } from '@/utils/schemas';

interface CreateNewCategoryProps {
  create?: boolean;
  initialData?: z.infer<typeof createCategoriesSchema>;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof createCategoriesSchema>) => void;
  onCancel?: () => void;
}

const CreateNewCategory = ({
  create = true,
  initialData = { name: '', description: '' },
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: CreateNewCategoryProps) => {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof createCategoriesSchema>>({
    resolver: zodResolver(createCategoriesSchema),
    defaultValues: initialData,
  });

  // Reset form values whenever dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      form.reset(initialData);
    }
  }, [open, form]);

  const onCancelHandler = () => {
    onCancel && onCancel();
    onOpenChange(false);
  };

  const onSubmitForm = async (data: z.infer<typeof createCategoriesSchema>) => {
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle>
            {create ? t('module.categoriesMgmt.create.title') : t('module.categoriesMgmt.edit.title')}{' '}
          </DialogTitle>
          <DialogDescription>
            {create ? t('module.categoriesMgmt.create.description') : t('module.categoriesMgmt.edit.description')}
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
                    {t('module.categoriesMgmt.create.name.label')}
                    {!createCategoriesSchema.shape.name.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('module.categoriesMgmt.create.name.placeholder')} />
                  </FormControl>
                  <FormDescription>{t('module.categoriesMgmt.create.name.description')}</FormDescription>
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
                    {t('module.categoriesMgmt.create.description.label')}
                    {!createCategoriesSchema.shape.description.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('module.categoriesMgmt.create.description.placeholder')}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>{t('module.categoriesMgmt.create.description.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="destructive" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.common.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <UtensilsCrossed className="size-5 mr-[6px]" />
                {create ? t('module.categoriesMgmt.button.create') : t('module.categoriesMgmt.button.edit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewCategory;
