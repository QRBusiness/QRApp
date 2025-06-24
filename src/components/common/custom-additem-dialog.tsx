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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '../ui/button';
import CustomSelect from './custom-select';

export interface FieldProps {
  options?: { value: string; label: string }[];
  disabled?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  description?: string;
  type?: 'input' | 'select' | 'textarea';
  isRequired?: boolean;
}

interface CustomAddItemDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  fields: FieldProps[];
  schema: z.ZodTypeAny;
  onClose?: () => void;
  onSubmit?: (values: any) => void;
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
      onSubmit(values);
    }
    setOpen(false);
    form.reset();
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
    onClose && onClose();
  };

  // Add event listener to close dialog on Escape key press and Enter key press
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      } else if (event.key === 'Enter' && open) {
        form.handleSubmit(handleSubmit)();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [form, handleClose, handleSubmit, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center space-x-2">
            <CirclePlus className="size-6" />
            <p>{title}</p>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6">
            {fields.map((fieldItem) => {
              if (fieldItem.type === 'input' || fieldItem.type === 'textarea' || !fieldItem.type) {
                return (
                  <FormField
                    key={fieldItem.name}
                    control={form.control}
                    name={fieldItem.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldItem.label} {fieldItem.isRequired && <span className="text-red-700">*</span>}
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
                );
              } else if (fieldItem.type === 'select') {
                return (
                  <FormField
                    key={fieldItem.name}
                    control={form.control}
                    name={fieldItem.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldItem.label} {fieldItem.isRequired && <span className="text-red-700">*</span>}
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-start space-x-2">
                            <CustomSelect
                              options={fieldItem.options || []}
                              onFieldChange={field.onChange}
                              value={field.value || ''}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>{fieldItem.description}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }
            })}
            <div className="grid grid-cols-2 space-x-2">
              <Button
                type="button"
                onClick={handleClose}
                variant={'outline'}
                className="hover:bg-destructive text-destructive-foreground"
              >
                <CircleX className="size-5 mr-[6px]" />
                <p>{t('module.qrManagement.additionalField.cancelButton')}</p>
              </Button>
              <Button type="button" onClick={form.handleSubmit(handleSubmit)}>
                <CirclePlus className="size-5 mr-[6px]" />
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
