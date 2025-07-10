import React, { useEffect } from 'react';
import { type bankResponse, useBanksInfo } from '@/services/owner/bank-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, CircleX, Landmark } from 'lucide-react';
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
import { configureBanksSchema } from '@/utils/schemas';

interface ConfigureBankProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof configureBanksSchema>) => void;
  onCancel?: () => void;
  initialData?: z.infer<typeof configureBanksSchema>;
}

const ConfigureBankAccount = ({
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  initialData,
}: ConfigureBankProps) => {
  const { t } = useTranslation();
  const { data: banksInfo } = useBanksInfo();
  const bankOptions =
    banksInfo?.map((bank: bankResponse) => ({
      value: bank.bin,
      label: `${bank.shortName} - ${bank.name}`,
    })) || [];
  const form = useForm<z.infer<typeof configureBanksSchema>>({
    resolver: zodResolver(configureBanksSchema),
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

  const onSubmitForm = (data: z.infer<typeof configureBanksSchema>) => {
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Landmark className="mr-2" /> {t('module.profile.configureBank.title')}
          </DialogTitle>
          <DialogDescription>{t('module.profile.configureBank.description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="bin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.profile.configureBank.bank.label')}
                    {!configureBanksSchema.shape.bin.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <CustomSelect
                      options={bankOptions}
                      onFieldChange={field.onChange}
                      placeholder={t('module.profile.configureBank.bank.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>{t('module.profile.configureBank.bank.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.profile.configureBank.accountNo.label')}
                    {!configureBanksSchema.shape.accountNo.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || ''}
                      placeholder={t('module.profile.configureBank.accountNo.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>{t('module.profile.configureBank.accountNo.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.profile.configureBank.accountName.label')}
                    {!configureBanksSchema.shape.accountName.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || ''}
                      placeholder={t('module.profile.configureBank.accountName.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>{t('module.profile.configureBank.accountName.description')}</FormDescription>
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

export default ConfigureBankAccount;
