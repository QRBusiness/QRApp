import React, { useEffect } from 'react';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createMenuItemSchema } from '@/utils/schemas';

interface CreateNewMenuDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const CreateNewMenuDialog = ({
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: CreateNewMenuDialogProps) => {
  const { t } = useTranslation();
  const categories = [
    { value: 'starters', label: 'Starters' },
    { value: 'main_dishes', label: 'Main Dishes' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'sides', label: 'Sides' },
  ];

  const subCategories = [
    { value: 'salads', label: 'Salads' },
    { value: 'soups', label: 'Soups' },
    { value: 'grilled', label: 'Grilled' },
    { value: 'pasta', label: 'Pasta' },
    { value: 'cakes', label: 'Cakes' },
  ];
  const form = useForm<z.infer<typeof createMenuItemSchema>>({
    resolver: zodResolver(createMenuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryName: '',
      subCategoryName: '',
      sizes: [{ name: 'S', price: 0 }],
      options: [],
    },
  });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control: form.control,
    name: 'sizes',
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

  const onSubmitForm = (data: z.infer<typeof createMenuItemSchema>) => {
    onSubmit && onSubmit();
    console.log('Menu item submitted:', data);
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
                  <FormDescription>
                    {t('module.menuManagement.createMenuField.nameDescription')}
                  </FormDescription>
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
                  <FormDescription>
                    {t('module.menuManagement.createMenuField.descriptionDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.menuManagement.createMenuField.categoryName')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start space-x-2">
                      <CustomSelect
                        options={categories}
                        onFieldChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
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
              name="subCategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.menuManagement.createMenuField.subCategoryName')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start space-x-2">
                      <CustomSelect
                        options={subCategories} // Replace with your subcategories options
                        onFieldChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
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
              <Label>{t('module.menuManagement.sizeField.label')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('module.menuManagement.sizeField.description')}
              </p>
              <div className="flex flex-col justify-start">
                {sizeFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-5 gap-2 mb-2 justify-end items-end">
                    <FormField
                      control={form.control}
                      name={`sizes.${index}.name`}
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
                      name={`sizes.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" onClick={() => removeSize(index)}>
                      <CircleX className="size-5 md:mr-2" />
                      <p className="hidden md:block">
                        {t('module.menuManagement.sizeField.remove')}
                      </p>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="default"
                  className="w-full md:w-fit min-w-[150px] flex justify-start"
                  onClick={() => appendSize({ name: '', price: 0 })}
                >
                  <CirclePlus className="size-5 mr-2" />
                  {t('module.menuManagement.sizeField.add')}
                </Button>
              </div>
            </div>
            {/* Option fields */}
            <div className="flex flex-col items-start gap-2">
              <Label>{t('module.menuManagement.optionField.label')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('module.menuManagement.optionField.description')}
              </p>
              <div className="flex flex-col justify-start">
                {optionFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-5 gap-2 mb-2 justify-end items-end">
                    <FormField
                      control={form.control}
                      name={`options.${index}.name`}
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
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" onClick={() => removeOption(index)}>
                      <CircleX className="size-5 mdmr-2" />
                      <p className="hidden md:block">
                        {t('module.menuManagement.optionField.remove')}
                      </p>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="default"
                  className="w-full md:w-fit min-w-[150px] flex justify-start"
                  onClick={() => appendOption({ name: '', price: 0 })}
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
                {t('module.menuManagement.action.add')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewMenuDialog;
