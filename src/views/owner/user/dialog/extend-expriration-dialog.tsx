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
import { Input } from '@/components/ui/input';
import { ownerExtendExpireDateSchema } from '@/utils/schemas';

interface EditBusinessDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof ownerExtendExpireDateSchema>) => void;
  onCancel?: () => void;
  initialData?: z.infer<typeof ownerExtendExpireDateSchema>;
}

const OwnerExtendExpireDateDialog = ({
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  initialData,
}: EditBusinessDialogProps) => {
  const { t } = useTranslation();
  const { plans } = usePlans();
  const [selectPlan, setSelectPlan] = React.useState('');

  const form = useForm<z.infer<typeof ownerExtendExpireDateSchema>>({
    resolver: zodResolver(ownerExtendExpireDateSchema),
    values: initialData,
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

  const onSubmitForm = (data: z.infer<typeof ownerExtendExpireDateSchema>) => {
    console.log('Submitted data:', data);
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
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.business.extend.plan.label')}
                    {!ownerExtendExpireDateSchema.shape.plan.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <CustomSelect
                      options={plans.map((plan) => ({
                        value: plan._id,
                        label: `${plan.name} - ${plan.price}`,
                      }))}
                      onFieldChange={(props) => {
                        setSelectPlan(props);
                        field.onChange(props);
                      }}
                      {...field}
                      placeholder={t('module.business.extend.plan.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>{t('module.business.extend.plan.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectPlan && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-58 h-58 object-cover flex justify-between items-center">
                  <img
                    src={plans.find((plan) => plan._id === selectPlan)?.qr_code || ''}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </div>
            )}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.business.extend.image.label')}
                    {!ownerExtendExpireDateSchema.shape.image.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      accept="image/*"
                      className="w-full"
                      placeholder={t('module.business.extend.image.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>{t('module.business.extend.image.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button action */}
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

export default OwnerExtendExpireDateDialog;
