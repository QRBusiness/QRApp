import React, { useEffect } from 'react';
import { useBranches } from '@/services/owner/branch-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, User } from 'lucide-react';
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
import { createUserSchema } from '@/utils/schemas';

interface CreateNewUserProps {
  create?: boolean;
  initialData?: z.infer<typeof createUserSchema>;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof createUserSchema>) => void;
  onCancel?: () => void;
}

const CreateNewUser = ({
  create = true,
  initialData = { name: '', phone: '', address: '', username: '', password: '', branch: '' },
  children,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: CreateNewUserProps) => {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: initialData,
  });
  const { branches } = useBranches({ page: 1, limit: 50 });
  const [branchOptions, setBranchOptions] = React.useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (branches && branches.length > 0) {
      const options = branches.map((branch) => ({
        label: branch.name,
        value: branch._id,
      }));
      setBranchOptions(options);
    }
  }, [branches]);

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

  const onSubmitForm = async (data: z.infer<typeof createUserSchema>) => {
    console.log('Form submitted with data:', data);
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle>
            {create ? t('module.staffManagement.create.title') : t('module.staffManagement.edit.title')}{' '}
          </DialogTitle>
          <DialogDescription>
            {create ? t('module.staffManagement.create.description') : t('module.staffManagement.edit.description')}
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.staffManagement.create.username.label')}
                    {!createUserSchema.shape.username.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.staffManagement.create.username.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.staffManagement.create.password.label')}
                    {!createUserSchema.shape.password.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!create} />
                  </FormControl>
                  <FormDescription>{t('module.staffManagement.create.password.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.staffManagement.create.name.label')}
                    {!createUserSchema.shape.name.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.staffManagement.create.name.description')}</FormDescription>
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
                    {t('module.staffManagement.create.phone.label')}
                    {!createUserSchema.shape.phone.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.staffManagement.create.phone.description')}</FormDescription>
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
                    {t('module.staffManagement.create.address.label')}
                    {!createUserSchema.shape.address.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t('module.staffManagement.create.address.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.staffManagement.create.branch.label')}
                    {!createUserSchema.shape.branch.isOptional() && <p className="text-red-700">*</p>}
                  </FormLabel>
                  <FormControl>
                    <CustomSelect
                      options={branchOptions}
                      {...field}
                      onFieldChange={field.onChange}
                      disabled={!create}
                    />
                  </FormControl>
                  <FormDescription>{t('module.staffManagement.create.branch.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="destructive" onClick={onCancelHandler}>
                <CircleX className="size-5" />
                {t('module.staffManagement.button.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                <User className="size-5 mr-[6px]" />
                {create ? t('module.staffManagement.button.create') : t('module.staffManagement.button.edit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewUser;
