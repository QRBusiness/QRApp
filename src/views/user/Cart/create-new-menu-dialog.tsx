import React, { useEffect } from 'react';
import { getSubcategories, useCategories } from '@/services/owner/categories-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus, CircleX, UtensilsCrossed } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Label } from '@/components/ui/label';
import { createProductSchema } from '@/utils/schemas';

interface CreateNewMenuDialogProps {
  isCreate?: boolean;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof createProductSchema>) => void;
  onCancel?: () => void;
  initialValues?: z.infer<typeof createProductSchema>;
}

const CreateNewMenuDialog = ({
  isCreate = true,
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  initialValues = {
    name: '',
    description: '',
    category: '',
    sub_category: '',
    variants: [{ type: 'S', price: 0 }],
    options: [],
  },
}: CreateNewMenuDialogProps) => {
  const { t } = useTranslation();
  const [subCategories, setSubCategories] = React.useState<{ label: string; value: string }[]>([]);
  const { categories } = useCategories();

  const categoriesOptions = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    values: initialValues,
  });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: 'options',
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

  const onSubmitForm = async (data: z.infer<typeof createProductSchema>) => {
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  const handleCategoryChange = async (value: string) => {
    const selectedCategory = categories.find((category) => category._id === value);
    if (selectedCategory) {
      const subcategories = await getSubcategories(selectedCategory._id);
      setSubCategories(
        subcategories.map((subcategory) => ({
          label: subcategory.name,
          value: subcategory._id,
        }))
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={initialValues.name}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? t('module.menuManagement.createTitle') : t('module.menuManagement.editTitle')}
          </DialogTitle>
          <DialogDescription>
            {isCreate ? t('module.menuManagement.createDescription') : t('module.menuManagement.editDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 w-full">
            {!isCreate && (
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('module.menuManagement.createMenuField.image')}
                      {!createProductSchema.shape.image.isOptional() && <p className="text-red-700">*</p>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          form.setValue('image', file);
                          field.onChange(file);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        placeholder={t('module.menuManagement.createMenuField.imagePlaceholder')}
                      />
                    </FormControl>
                    <FormDescription>{t('module.menuManagement.createMenuField.imageDescription')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.menuManagement.createMenuField.name')}
                    {!createProductSchema.shape.name.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('module.menuManagement.createMenuField.namePlaceholder')} />
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
                    {!createProductSchema.shape.description.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('module.menuManagement.createMenuField.descriptionPlaceholder')}
                    />
                  </FormControl>
                  <FormDescription>{t('module.menuManagement.createMenuField.descriptionDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.menuManagement.createMenuField.categoryName')}
                    {!createProductSchema.shape.category.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start space-x-2">
                      <CustomSelect
                        disabled={isCreate ? false : true}
                        options={categoriesOptions}
                        onFieldChange={(props) => {
                          field.onChange(props);
                          handleCategoryChange(props);
                        }}
                        value={field.value}
                        defaultValue={field.value}
                        placeholder={t('module.menuManagement.createMenuField.categoryNamePlaceholder')}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t('module.menuManagement.createMenuField.categoryNameDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sub_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.menuManagement.createMenuField.subCategoryName')}
                    {!createProductSchema.shape.sub_category.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start space-x-2">
                      <CustomSelect
                        disabled={isCreate ? false : true}
                        options={subCategories} // Replace with your subcategories options
                        onFieldChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        placeholder={t('module.menuManagement.createMenuField.subCategoryNamePlaceholder')}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t('module.menuManagement.createMenuField.subCategoryNameDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Size fields */}
            <div className="flex flex-col items-start gap-2">
              <Label>
                {t('module.menuManagement.sizeField.label')}
                {!createProductSchema.shape.variants.isOptional() && <p className="text-red-700">*</p>}
              </Label>
              <p className="text-sm text-muted-foreground">{t('module.menuManagement.sizeField.description')}</p>
              <div className="flex flex-col justify-start min-w-3/4 flex-1">
                {sizeFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-5 gap-2 mb-2 justify-end items-end">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>{t('module.menuManagement.sizeField.name')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" onClick={() => removeSize(index)}>
                      <CircleX className="size-5 md:mr-2" />
                      <p className="hidden md:block">{t('module.menuManagement.sizeField.remove')}</p>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="default"
                  className="w-full md:w-fit min-w-[150px] flex justify-start"
                  onClick={() => appendSize({ type: '', price: 0 })}
                >
                  <CirclePlus className="size-5 mr-2" />
                  {t('module.menuManagement.sizeField.add')}
                </Button>
              </div>
            </div>
            {/* Option fields */}
            <div className="flex flex-col items-start gap-2">
              <Label>
                {t('module.menuManagement.optionField.label')}
                {!createProductSchema.shape.options.isOptional() && <p className="text-red-700">*</p>}
              </Label>
              <p className="text-sm text-muted-foreground">{t('module.menuManagement.optionField.description')}</p>
              <div className="flex flex-col justify-start flex-1 min-w-3/4">
                {optionFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-5 gap-2 mb-2 justify-end items-end">
                    <FormField
                      control={form.control}
                      name={`options.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>{t('module.menuManagement.optionField.name')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`options.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>{t('module.menuManagement.optionField.price')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" onClick={() => removeOption(index)}>
                      <CircleX className="size-5 mdmr-2" />
                      <p className="hidden md:block">{t('module.menuManagement.optionField.remove')}</p>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="default"
                  className="w-full md:w-fit min-w-[150px] flex justify-start"
                  onClick={() => appendOption({ type: '', price: 0 })}
                >
                  <CirclePlus className="size-5 mr-2" />
                  {t('module.menuManagement.optionField.add')}
                </Button>
              </div>
            </div>
            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.menuManagement.action.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <UtensilsCrossed className="size-5 mr-[6px]" />
                {isCreate ? t('module.menuManagement.action.add') : t('module.menuManagement.action.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewMenuDialog;
