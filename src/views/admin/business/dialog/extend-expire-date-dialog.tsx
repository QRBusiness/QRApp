import React, { useEffect } from 'react';
import { usePlans } from '@/services/admin/plan-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, CircleX, ClockPlus } from 'lucide-react';
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
import { extendExpireDateSchema } from '@/utils/schemas';

interface EditBusinessDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof extendExpireDateSchema>) => void;
  onCancel?: () => void;
  initialData?: z.infer<typeof extendExpireDateSchema>;
}

const ExtendExpireDateDialog = ({
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  initialData,
}: EditBusinessDialogProps) => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof extendExpireDateSchema>>({
    resolver: zodResolver(extendExpireDateSchema),
    values: initialData,
  });

  const { plans } = usePlans();
  const planOptions =
    plans?.map((plan) => ({
      value: plan._id,
      label: `${plan.name}`,
    })) || [];

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const onCancelHandler = () => {
    onCancel && onCancel();
    onOpenChange(false);
  };

  const onSubmitForm = (data: z.infer<typeof extendExpireDateSchema>) => {
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClockPlus className="mr-2" /> {t('module.business.extend.title')}
          </DialogTitle>
          <DialogDescription>{t('module.business.extend.description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 w-full">
            {/* Button action */}
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.business.extend.plan.label')}
                    {!extendExpireDateSchema.shape.plan.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <CustomSelect
                      options={planOptions}
                      onFieldChange={field.onChange}
                      placeholder={t('module.business.extend.plan.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>{t('module.business.extend.plan.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.business.extend.button.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <CircleCheck className="size-5 mr-[6px]" />
                {t('module.business.extend.button.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExtendExpireDateDialog;
