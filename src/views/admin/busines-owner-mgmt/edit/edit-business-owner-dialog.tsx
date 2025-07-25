import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, CircleX, UserRoundPen } from 'lucide-react';
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
import { editUserSchema } from '@/utils/schemas';

interface EditBusinessOwnerDialogProps {
  isUser?: boolean;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof editUserSchema>) => void;
  onCancel?: () => void;
  initialData?: z.infer<typeof editUserSchema>;
}

const EditBusinessOwnerDialog = ({
  isUser = false,
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  initialData,
}: EditBusinessOwnerDialogProps) => {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: initialData,
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

  const onSubmitForm = async (data: z.infer<typeof editUserSchema>) => {
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRoundPen />{' '}
            {isUser ? t('module.staffManagement.edit.title') : t('module.businessOwner.editField.title')}
          </DialogTitle>
          <DialogDescription>
            {isUser ? t('module.staffManagement.edit.description') : t('module.businessOwner.editField.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isUser
                      ? t('module.staffManagement.create.name.label')
                      : t('module.businessOwner.editField.name.label')}
                    {!editUserSchema.shape.name.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {isUser
                      ? t('module.staffManagement.create.name.description')
                      : t('module.businessOwner.editField.name.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isUser
                      ? t('module.staffManagement.create.email.label')
                      : t('module.businessOwner.editField.email.label')}
                    {!editUserSchema.shape.email.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t('module.businessOwner.editField.email.placeholder')}
                    />
                  </FormControl>
                  <FormDescription>
                    {isUser
                      ? t('module.staffManagement.create.email.description')
                      : t('module.businessOwner.editField.email.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isUser
                      ? t('module.staffManagement.create.address.label')
                      : t('module.businessOwner.editField.address.label')}
                    {!editUserSchema.shape.address.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {isUser
                      ? t('module.staffManagement.create.address.description')
                      : t('module.businessOwner.editField.address.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isUser
                      ? t('module.staffManagement.create.phone.label')
                      : t('module.businessOwner.editField.phone.label')}
                    {!editUserSchema.shape.phone.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {isUser
                      ? t('module.staffManagement.create.phone.description')
                      : t('module.businessOwner.editField.phone.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isUser
                      ? t('module.staffManagement.create.username.label')
                      : t('module.businessOwner.editField.username.label')}
                    {!editUserSchema.shape.username.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={true} />
                  </FormControl>
                  <FormDescription>
                    {isUser
                      ? t('module.staffManagement.create.username.description')
                      : t('module.businessOwner.editField.username.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.businessOwner.editField.button.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <CircleCheck className="size-5 mr-[6px]" />
                {t('module.businessOwner.editField.button.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBusinessOwnerDialog;
