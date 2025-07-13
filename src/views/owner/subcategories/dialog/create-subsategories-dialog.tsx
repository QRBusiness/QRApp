import React, { useEffect } from 'react';
import { useCategories } from '@/services/owner/categories-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, UtensilsCrossed } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import CustomSelect from '@/components/common/custom-select';
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
import { createSubCategoriesSchema } from '@/utils/schemas';

interface CreateNewCategoryProps {
  create?: boolean;
  initialData?: z.infer<typeof createSubCategoriesSchema>;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof createSubCategoriesSchema>) => void;
  onCancel?: () => void;
}

const CreateNewSubCategory = ({
  create = true,
  initialData = { name: '', description: '', category: '' },
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: CreateNewCategoryProps) => {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof createSubCategoriesSchema>>({
    resolver: zodResolver(createSubCategoriesSchema),
    defaultValues: initialData,
  });
  const [categoryOptions, setCategoryOptions] = React.useState<{ label: string; value: string }[]>([]);
  const { categories } = useCategories();

  React.useEffect(() => {
    if (categories && categories.length > 0) {
      const options = categories.map((category) => ({
        label: category.name,
        value: category._id,
      }));
      setCategoryOptions(options);
    }
  }, [categories]);

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

  const onSubmitForm = async (data: z.infer<typeof createSubCategoriesSchema>) => {
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle>
            {create
              ? t('module.categoriesMgmt.subCategories.create.title')
              : t('module.categoriesMgmt.subCategories.edit.title')}{' '}
          </DialogTitle>
          <DialogDescription>
            {create
              ? t('module.categoriesMgmt.subCategories.create.description')
              : t('module.categoriesMgmt.subCategories.edit.description')}
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.categoriesMgmt.subCategories.create.category.label')}
                    {!createSubCategoriesSchema.shape.category.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <CustomSelect
                      options={categoryOptions}
                      onFieldChange={field.onChange}
                      {...field}
                      placeholder={t('module.categoriesMgmt.subCategories.create.category.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('module.categoriesMgmt.subCategories.create.category.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.categoriesMgmt.subCategories.create.name.label')}
                    {!createSubCategoriesSchema.shape.name.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('module.categoriesMgmt.subCategories.create.name.placeholder')} />
                  </FormControl>
                  <FormDescription>{t('module.categoriesMgmt.subCategories.create.name.description')}</FormDescription>
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
                    {t('module.categoriesMgmt.subCategories.create.description.label')}
                    {!createSubCategoriesSchema.shape.description.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('module.categoriesMgmt.subCategories.create.description.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('module.categoriesMgmt.subCategories.create.description.description')}
                  </FormDescription>
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
                {create
                  ? t('module.categoriesMgmt.subCategories.button.create')
                  : t('module.categoriesMgmt.subCategories.button.edit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewSubCategory;
