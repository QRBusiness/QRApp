import React from 'react';
import { getAreas, useCreateArea } from '@/services/owner/area-service';
import { useBranches } from '@/services/owner/branch-service';
import { getTables, useCreateTable } from '@/services/owner/table-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { createAdditionalFieldSchema, createAreaSchema, createQRSchema, createTableSchema } from '@/utils/schemas';

interface MobileCreateDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit?: (values: any) => void;
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
  const queryClient = useQueryClient();
  const [additionalInfo, setAdditionalInfo] = React.useState<any[]>([]);
  const [branchOptions, setBranchOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [areaOptions, setAreaOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [tableOptions, setTableOptions] = React.useState<{ value: string; label: string }[]>([]);

  const { branches } = useBranches({ page: 1, limit: 50 });
  const { createArea, data: createdArea } = useCreateArea();
  const { createTable, data: createdTable } = useCreateTable();
  // const { updateTable } = useUpdateTable();

  React.useEffect(() => {
    if (branches.length > 0) {
      setBranchOptions(
        branches.map((branch) => ({
          value: branch._id,
          label: branch.name,
        }))
      );
    }
  }, [branches]);

  const additionalFields: FieldProps[] = [
    {
      name: 'name',
      label: t('module.qrManagement.additionalField.fieldName'),
      description: t('module.qrManagement.additionalField.fieldNameDescription'),
      isRequired: true,
    },
    {
      name: 'value',
      label: t('module.qrManagement.additionalField.fieldValue'),
      description: t('module.qrManagement.additionalField.fieldValueDescription'),
      isRequired: true,
    },
  ];

  const addAreaFields: FieldProps[] = [
    {
      name: 'name',
      label: t('module.qrManagement.addAreaField.fieldName'),
      description: t('module.qrManagement.addAreaField.fieldNameDescription'),
      isRequired: true,
    },
    {
      name: 'description',
      label: t('module.qrManagement.addAreaField.fieldDescription'),
      description: t('module.qrManagement.addAreaField.fieldDescriptionDescription'),
      isRequired: false,
    },
    {
      name: 'image_url',
      label: t('module.qrManagement.addAreaField.fieldImageUrl'),
      description: t('module.qrManagement.addAreaField.fieldImageUrlDescription'),
      isRequired: false,
    },
    {
      name: 'branch',
      label: t('module.qrManagement.addAreaField.fieldBranchId'),
      description: t('module.qrManagement.addAreaField.fieldBranchIdDescription'),
      type: 'select',
      options: branchOptions,
      isRequired: true,
    },
  ];

  const addTableFields: FieldProps[] = [
    {
      name: 'name',
      label: t('module.qrManagement.addTableField.fieldName'),
      description: t('module.qrManagement.addTableField.fieldNameDescription'),
      isRequired: true,
    },
    {
      name: 'area',
      label: t('module.qrManagement.addTableField.fieldAreaId'),
      description: t('module.qrManagement.addTableField.fieldAreaIdDescription'),
      type: 'select',
      options: areaOptions.map((area) => ({
        value: area.value,
        label: area.label,
      })),
      isRequired: true,
    },
    {
      name: 'description',
      label: t('module.qrManagement.addTableField.fieldDescription'),
      description: t('module.qrManagement.addTableField.fieldDescriptionDescription'),
      isRequired: false,
    },
  ];

  const form = useForm<z.infer<typeof createQRSchema>>({
    resolver: zodResolver(createQRSchema),
    values: {
      branch: '',
      area: '',
      table: '',
    },
  });

  const handleCreateArea = async (values: z.infer<typeof createAreaSchema>) => {
    await createArea({
      name: values.name,
      description: values.description,
      branch: values.branch,
    });
  };

  const handleCreateTable = async (values: z.infer<typeof createTableSchema>) => {
    await createTable({
      name: values.name,
      area: values.area,
      description: values.description,
    });
  };

  React.useEffect(() => {
    if (createdArea && createdArea.branch._id === form.getValues('branch')) {
      const newArea = {
        value: createdArea._id,
        label: createdArea.name,
      };
      setAreaOptions((prev) => [...prev, newArea]);
    }
  }, [createdArea]);

  React.useEffect(() => {
    if (createdTable && createdTable.area._id === form.getValues('area')) {
      const newTable = {
        value: createdTable._id,
        label: createdTable.name,
      };
      setTableOptions((prev) => [...prev, newTable]);
    }
  }, [createdTable]);

  const handleBranchChange = async (branch: string) => {
    form.setValue('branch', branch);
    form.setValue('area', '');
    form.setValue('table', '');

    const areas = await queryClient.fetchQuery({
      queryKey: ['areasQuery'],
      queryFn: () => getAreas({ page: 1, limit: 50, branch }),
    });

    const areaOptions = areas.map((area: any) => ({
      value: area._id,
      label: area.name,
    }));
    setAreaOptions(areaOptions);
  };

  const handleAreaChange = async (area: string) => {
    form.setValue('area', area);
    form.setValue('table', '');

    const tables = await queryClient.fetchQuery({
      queryKey: ['tablesQuery'],
      queryFn: () => getTables({ page: 1, limit: 50, area }),
    });

    const tableOptions = tables.map((table: any) => ({
      value: table._id,
      label: table.name,
    }));
    setTableOptions(tableOptions);
  };

  const onSubmitForm = (values: z.infer<typeof createQRSchema>) => {
    onSubmit &&
      onSubmit({
        ...values,
        additionalInfo,
      });
  };

  const onCancelForm = () => {
    onCancel && onCancel();
    form.reset({
      branch: '',
      area: '',
      table: '',
    });
    setAdditionalInfo([]);
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
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 w-full">
            {/* Branch Field */}
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.branchManagement.title')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start space-x-2">
                      <CustomSelect
                        options={branchOptions}
                        onFieldChange={(props) => {
                          field.onChange(props);
                          handleBranchChange(props);
                        }}
                        value={field.value || ''}
                        placeholder={t('module.branchManagement.placeholder')}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>{t('module.branchManagement.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Area   */}
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
                        options={areaOptions}
                        onFieldChange={(props) => {
                          field.onChange(props);
                          handleAreaChange(props);
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      />
                      <CustomAddItemDialog
                        title={t('module.qrManagement.addAreaField.title')}
                        description={t('module.qrManagement.addAreaField.description')}
                        schema={createAreaSchema}
                        onSubmit={(values) => handleCreateArea(values)}
                        fields={addAreaFields}
                      >
                        <Button type="button" variant="default">
                          <Plus className="size-5 md:mr-[6px]" />
                          <p className="hidden md:block">{t('module.qrManagement.addAreaField.create')}</p>
                        </Button>
                      </CustomAddItemDialog>
                    </div>
                  </FormControl>
                  <FormDescription>{t('module.area.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Table Field */}
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
                        options={tableOptions}
                        onFieldChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      />
                      <CustomAddItemDialog
                        title={t('module.qrManagement.addTableField.title')}
                        description={t('module.qrManagement.addTableField.description')}
                        schema={createTableSchema}
                        onSubmit={(values) => handleCreateTable(values)}
                        fields={addTableFields}
                      >
                        <Button type="button" variant="default">
                          <Plus className="size-5 md:mr-[6px]" />
                          <p className="hidden sm:block">{t('module.qrManagement.addTableField.create')}</p>
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
                      onClick={() => setAdditionalInfo((prev) => prev.filter((_, i) => i !== index))}
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
              <Button type="button" variant="outline" onClick={onCancelForm}>
                {cancelIcon ? cancelIcon : <CircleX className="size-5 mr-[6px]" />}
                {cancelButtonText ? cancelButtonText : t('module.qrManagement.cancel')}
              </Button>

              <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                {submitIcon ? submitIcon : <QrCode className="size-5 mr-[6px]" />}
                {submitButtonText ? submitButtonText : t('module.qrManagement.create')}
              </Button>
            </DialogFooter>
            <div className="flex items-center justify-end space-x-2">{/* Reset and Submit buttons */}</div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MobileCreateDialog;
