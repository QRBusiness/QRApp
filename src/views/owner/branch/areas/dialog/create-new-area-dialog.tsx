import React, { useEffect } from 'react';
import { useBranches } from '@/services/owner/branch-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, Edit, Plus } from 'lucide-react';
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
import { createAreaSchema } from '@/utils/schemas';

interface CreateNewAreaProps {
  create?: boolean;
  initialData?: z.infer<typeof createAreaSchema>;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof createAreaSchema>) => void;
  onCancel?: () => void;
}

const CreateNewArea = ({
  create = true,
  initialData = { name: '', branch: '' },
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: CreateNewAreaProps) => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof createAreaSchema>>({
    resolver: zodResolver(createAreaSchema),
    defaultValues: initialData,
  });

  const { branches } = useBranches({ page: 1, limit: 50 });
  const branchOptions = branches.map((branch) => ({
    value: branch._id,
    label: branch.name,
  }));

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

  const onSubmitForm = (data: z.infer<typeof createAreaSchema>) => {
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
              ? t('module.qrManagement.addAreaField.title')
              : t('module.qrManagement.addAreaField.edit.title')}{' '}
          </DialogTitle>
          <DialogDescription>
            {create
              ? t('module.qrManagement.addAreaField.description')
              : t('module.qrManagement.addAreaField.edit.description')}
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
                    {t('module.qrManagement.addAreaField.fieldName')}
                    {!createAreaSchema.shape.name.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.qrManagement.addAreaField.fieldNameDescription')}</FormDescription>
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
                    {t('module.qrManagement.addAreaField.fieldDescription')}
                    {!createAreaSchema.shape.description.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.qrManagement.addAreaField.fieldDescriptionDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.qrManagement.addAreaField.fieldImageUrl')}
                    {!createAreaSchema.shape.image_url.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.qrManagement.addAreaField.fieldImageUrlDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.qrManagement.addAreaField.fieldBranchId')}
                    {!createAreaSchema.shape.branch.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <CustomSelect
                      options={branchOptions}
                      {...field}
                      onFieldChange={field.onChange}
                      disabled={!create}
                    />
                  </FormControl>
                  <FormDescription>{t('module.qrManagement.addAreaField.fieldBranchIdDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="destructive" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.qrManagement.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                {create ? <Plus className="size-5 mr-[6px]" /> : <Edit className="size-5 mr-[6px]" />}
                {create ? t('module.qrManagement.addAreaField.create') : t('module.qrManagement.addAreaField.edit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewArea;
