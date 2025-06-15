import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, Info, Plus, QrCode, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import CustomAddItemDialog, { type FieldProps } from '@/components/common/custom-additem-dialog';
import CustomSelect from '@/components/common/custom-select';
import { Hint } from '@/components/common/hint';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  createAdditionalFieldSchema,
  createAreaSchema,
  createQRSchema,
  createTableSchema,
} from '@/utils/schemas';

interface MobileCreateDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  submitIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
}

const MobileCreateDialog: React.FC<MobileCreateDialogProps> = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  onCancel,
  submitButtonText,
  cancelButtonText,
  submitIcon,
  cancelIcon,
}) => {
  const { t } = useTranslation();
  const [additionalInfo, setAdditionalInfo] = React.useState<any[]>([]);
  const areaOptionsDefault = [
    { value: 'area1', label: 'Area 1' },
    { value: 'area2', label: 'Area 2' },
    { value: 'area3', label: 'Area 3' },
  ];

  const tableOptionsDefault = [
    { value: 'table1', label: 'Table 1' },
    { value: 'table2', label: 'Table 2' },
    { value: 'table3', label: 'Table 3' },
  ];

  const addAreaFields: FieldProps[] = [
    {
      name: 'name',
      label: t('module.qrManagement.addAreaField.fieldName'),
      description: t('module.qrManagement.addAreaField.fieldNameDescription'),
    },
    {
      name: 'description',
      label: t('module.qrManagement.addAreaField.fieldDescription'),
      description: t('module.qrManagement.addAreaField.fieldDescriptionDescription'),
    },
  ];
  const addTableFields: FieldProps[] = [
    {
      name: 'name',
      label: t('module.qrManagement.addTableField.fieldName'),
      description: t('module.qrManagement.addTableField.fieldNameDescription'),
    },
    {
      name: 'areaId',
      label: t('module.qrManagement.addTableField.fieldAreaId'),
      description: t('module.qrManagement.addTableField.fieldAreaIdDescription'),
    },
    {
      name: 'description',
      label: t('module.qrManagement.addTableField.fieldDescription'),
      description: t('module.qrManagement.addTableField.fieldDescriptionDescription'),
    },
  ];
  const additionalFields: FieldProps[] = [
    {
      name: 'name',
      label: t('module.qrManagement.additionalField.fieldName'),
      description: t('module.qrManagement.additionalField.fieldNameDescription'),
    },
    {
      name: 'value',
      label: t('module.qrManagement.additionalField.fieldValue'),
      description: t('module.qrManagement.additionalField.fieldValueDescription'),
    },
  ];

  const form = useForm<z.infer<typeof createQRSchema>>({
    resolver: zodResolver(createQRSchema),
    defaultValues: {
      area: areaOptionsDefault[0].value,
      table: tableOptionsDefault[0].value,
    },
  });

  const onSubmitForm = (values: z.infer<typeof createQRSchema>) => {
    console.log('Form submitted with values:', values);
    onSubmit && onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogDescription>{t(description ?? '')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.area.title')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start space-x-2">
                      <CustomSelect
                        options={areaOptionsDefault}
                        onFieldChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      />
                      <CustomAddItemDialog
                        title={t('module.qrManagement.addAreaField.title')}
                        description={t('module.qrManagement.addAreaField.description')}
                        schema={createAreaSchema}
                        onSubmit={(values) => {
                          console.log('Area created:', values);
                        }}
                        fields={addAreaFields}
                      >
                        <Button type="button" variant="default">
                          <Plus className="size-5 md:mr-[6px]" />
                          <p className="hidden md:block">
                            {t('module.qrManagement.addAreaField.create')}
                          </p>
                        </Button>
                      </CustomAddItemDialog>
                    </div>
                  </FormControl>
                  <FormDescription>{t('module.area.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="table"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.table.title')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start space-x-2">
                      <CustomSelect
                        options={tableOptionsDefault}
                        onFieldChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      />
                      <CustomAddItemDialog
                        title={t('module.qrManagement.addTableField.title')}
                        description={t('module.qrManagement.addTableField.description')}
                        schema={createTableSchema}
                        onSubmit={(values) => {
                          console.log('Table created:', values);
                        }}
                        fields={addTableFields}
                      >
                        <Button type="button" variant="default">
                          <Plus className="size-5 md:mr-[6px]" />
                          <p className="hidden sm:block">
                            {t('module.qrManagement.addTableField.create')}
                          </p>
                        </Button>
                      </CustomAddItemDialog>
                    </div>
                  </FormControl>
                  <FormDescription>{t('module.table.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Additional Info Fields */}
            <div className="space-y-2 flex flex-col items-start justify-start">
              <FormLabel>{t('module.qrManagement.table.additionalFields')}</FormLabel>
              <p className="text-sm text-muted-foreground">
                {t('module.qrManagement.table.additionalFieldsDescription')}
              </p>
              <div className="grid grid-cols-2 gap-2 w-full">
                {additionalInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between space-x-2 px-3 py-2 shadow-md group flex-1 border rounded-md group"
                  >
                    <Hint label={info.value} sideOffset={10}>
                      <Label className="flex items-center cursor-pointer capitalize">
                        <Info className="size-3 mr-1" />
                        {info.name}
                      </Label>
                    </Hint>
                    <Label
                      className="cursor-pointer group-hover:bg-destructive group-hover:text-destructive-foreground rounded-md"
                      onClick={() =>
                        setAdditionalInfo((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      <X className="size-5" />
                    </Label>
                  </div>
                ))}
              </div>
              <div>
                <CustomAddItemDialog
                  title={t('module.qrManagement.additionalField.title')}
                  description={t('module.qrManagement.additionalField.description')}
                  schema={createAdditionalFieldSchema}
                  onSubmit={(values) => setAdditionalInfo((prev) => [...prev, values])}
                  fields={additionalFields}
                >
                  <Button type="button" variant={'default'}>
                    <Plus className="size-5 mr-[6px]" />
                    <p>{t('module.qrManagement.additionalField.buttonTriggerTitle')}</p>
                  </Button>
                </CustomAddItemDialog>
              </div>
            </div>
            {/* Button action */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                {cancelIcon ? cancelIcon : <CircleX className="size-5 mr-[6px]" />}
                {cancelButtonText ? cancelButtonText : t('module.qrManagement.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                {submitIcon ? submitIcon : <QrCode className="size-5 mr-[6px]" />}
                {submitButtonText ? submitButtonText : t('module.qrManagement.create')}
              </Button>
            </DialogFooter>
            <div className="flex items-center justify-end space-x-2">
              {/* Reset and Submit buttons */}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MobileCreateDialog;
