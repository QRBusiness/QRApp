import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus, CircleX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from '../ui/button';

export interface FieldProps {
  disabled?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  description?: string;
}

interface CustomAddItemDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  fields: FieldProps[];
  schema: z.ZodTypeAny;
  onClose?: () => void;
  onSubmit?: (values: object) => void;
}

const CustomAddItemDialog: React.FC<CustomAddItemDialogProps> = ({
  children,
  title,
  description,
  onClose,
  onSubmit,
  schema,
  fields,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce(
      (acc, field) => {
        acc[field.name] = '';
        return acc;
      },
      {} as Record<string, any>
    ),
  });

  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (values: z.infer<typeof schema>) => {
    if (onSubmit) {
      onSubmit({ ...values });
    }
    setOpen(false);
    form.reset();
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6">
            {fields.map((fieldItem) => (
              <FormField
                key={fieldItem.name}
                control={form.control}
                name={fieldItem.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {fieldItem.label} <span className="text-red-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        disabled={fieldItem.disabled}
                        placeholder={fieldItem.placeholder || ''}
                        className="w-full p-2 border rounded"
                      />
                    </FormControl>
                    <FormDescription>{fieldItem.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={handleClose}
                variant={'outline'}
                className="hover:bg-destructive text-destructive-foreground min-w-[120px]"
              >
                <CircleX className="size-4 mr-[6px]" />
                <p>{t('module.qrManagement.additionalField.cancelButton')}</p>
              </Button>
              <Button
                type="button"
                className="min-w-[120px]"
                onClick={form.handleSubmit(handleSubmit)}
              >
                <CirclePlus className="size-4 mr-[6px]" />
                <p>{t('module.qrManagement.additionalField.submitButton')}</p>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomAddItemDialog;
