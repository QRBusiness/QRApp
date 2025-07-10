import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, CircleCheck, CircleX } from 'lucide-react';
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
import { createRequestSchema } from '@/utils/schemas';

interface CreateRequestProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof createRequestSchema>) => void;
  onCancel?: () => void;
  initialData?: z.infer<typeof createRequestSchema>;
}

const CreateRequestDialog = ({ children, open, onOpenChange, onSubmit, onCancel, initialData }: CreateRequestProps) => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof createRequestSchema>>({
    resolver: zodResolver(createRequestSchema),
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

  const onSubmitForm = (data: z.infer<typeof createRequestSchema>) => {
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
            <BellRing className="mr-2" /> {t('module.guestUser.createRequest.title')}
          </DialogTitle>
          <DialogDescription>{t('module.guestUser.createRequest.description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="request"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.guestUser.createRequest.request.label')}
                    {!createRequestSchema.shape.request.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || ''}
                      placeholder={t('module.guestUser.createRequest.request.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>{t('module.guestUser.createRequest.request.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.guestUser.createRequest.button.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <CircleCheck className="size-5 mr-[6px]" />
                {t('module.guestUser.createRequest.button.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRequestDialog;
