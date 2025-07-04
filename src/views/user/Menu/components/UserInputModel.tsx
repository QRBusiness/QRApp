import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createGuestUserSchema } from '@/utils/schemas';

export interface UserInputModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof createGuestUserSchema>) => void;
}

const UserInputModel: React.FC<UserInputModelProps> = ({ open, onOpenChange, onSubmit }) => {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof createGuestUserSchema>>({
    resolver: zodResolver(createGuestUserSchema),
  });

  const handleSubmit = (values: z.infer<typeof createGuestUserSchema>) => {
    onOpenChange(false); // Close the dialog after submission
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>{t('module.guestUser.create.title')}</DialogTitle>
            <DialogDescription>{t('module.guestUser.create.description')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.guestUser.field.name.label')}
                    {createGuestUserSchema.shape.name.isOptional() ? '' : <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('module.guestUser.field.name.placeholder')} type="text" {...field} />
                  </FormControl>
                  <FormDescription>{t('module.guestUser.field.name.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="mt-4">
                {t('module.guestUser.button.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserInputModel;
