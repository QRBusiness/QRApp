import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CalendarPlus, CalendarSync, CircleX } from 'lucide-react';
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
import { updatePlanSchema } from '@/utils/schemas';

interface CreateNewPlanProps {
  create?: boolean;
  initialData?: z.infer<typeof updatePlanSchema>;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof updatePlanSchema>) => void;
  onCancel?: () => void;
}

const CreateNewPlan = ({
  create = true,
  initialData = { name: '', period: 0, price: 0 },
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: CreateNewPlanProps) => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof updatePlanSchema>>({
    resolver: zodResolver(updatePlanSchema),
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

  const onSubmitForm = (data: z.infer<typeof updatePlanSchema>) => {
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {create ? <CalendarPlus /> : <CalendarSync />}
            {create ? t('module.plan.create.title') : t('module.plan.edit.title')}{' '}
          </DialogTitle>
          <DialogDescription>
            {create ? t('module.plan.create.description') : t('module.plan.edit.description')}
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
                    {t('module.plan.create.name.label')}
                    {!updatePlanSchema.shape.name.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('module.plan.create.name.placeholder')}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>{t('module.plan.create.name.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.plan.create.period.label')}
                    {!updatePlanSchema.shape.period.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder={t('module.plan.create.period.placeholder')}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>{t('module.plan.create.period.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!create && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('module.plan.create.price.label')}
                      {!updatePlanSchema.shape.price.isOptional() && <p className="text-red-700">*</p>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder={t('module.plan.create.price.placeholder')}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>{t('module.plan.create.price.description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="destructive" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.plan.action.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <Building2 className="size-5 mr-[6px]" />
                {create ? t('module.plan.action.create') : t('module.plan.action.edit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewPlan;
