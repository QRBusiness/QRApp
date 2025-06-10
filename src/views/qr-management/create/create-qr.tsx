import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus, CircleX, Info, Plus, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import CustomAddItemDialog, { type FieldProps } from '@/components/common/custom-additem-dialog';
import CustomSelect from '@/components/common/custom-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  createAdditionalFieldSchema,
  createAreaSchema,
  createQRSchema,
  createTableSchema,
} from '@/utils/schemas';

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

const CreateQR = () => {
  const { t } = useTranslation();
  const [additionalInfo, setAdditionalInfo] = React.useState<any[]>([]);
  const [areaOptions, setAreaOptions] = React.useState(areaOptionsDefault);
  const [tableOptions, setTableOptions] = React.useState(tableOptionsDefault);

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

  const form = useForm<z.infer<typeof createQRSchema>>({
    resolver: zodResolver(createQRSchema),
    defaultValues: {
      area: areaOptions[0].value,
      table: tableOptions[0].value,
    },
  });

  const onSubmit = (values: z.infer<typeof createQRSchema>) => {
    console.log('Form submitted with values:', values);
  };

  console.log({ additionalInfo });

  return (
    <div className="container mx-auto w-full border rounded shadow-md p-4">
      <h4 className="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
        {t('module.qrManagement.table.title')}
      </h4>
      <div className="flex flex-col flex-1 lg:flex-row items-start justify-start space-y-4 lg:space-y-0 lg:space-x-4 w-full h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full lg:max-w-3/4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('module.area.title')}</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start space-x-2">
                      <CustomSelect
                        options={areaOptions}
                        onFieldChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      />
                      <CustomAddItemDialog
                        title={t('module.qrManagement.addAreaField.title')}
                        description={t('module.qrManagement.addAreaField.description')}
                        schema={createAreaSchema}
                        onSubmit={(values) =>
                          setAreaOptions((prev) => [
                            ...prev,
                            {
                              value: values.name.toLowerCase().replace(/\s+/g, '-'),
                              label: values.name,
                            },
                          ])
                        }
                        fields={addAreaFields}
                      >
                        <Button type="button" variant="default">
                          <Plus className="size-4 md:mr-[6px]" />
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
                  <FormLabel>{t('module.table.title')}</FormLabel>
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
                        onSubmit={(values) =>
                          setTableOptions((prev) => [
                            ...prev,
                            {
                              value: values.name.toLowerCase().replace(/\s+/g, '-'),
                              label: values.name,
                            },
                          ])
                        }
                        fields={addTableFields}
                      >
                        <Button type="button" variant="default">
                          <Plus className="size-4 md:mr-[6px]" />
                          <p className="hidden md:block">
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
              {additionalInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex relative items-center justify-start space-x-2 px-3 py-2 border rounded shadow-md group"
                >
                  <Label>
                    <Info className="mr-1" />
                    {info.name}
                  </Label>
                  :
                  <Badge variant="secondary" className="text-base ml-2">
                    {info.value}
                  </Badge>
                  <Tag className="absolute -right-4 -top-4 rotate-270 fill-primary text-black/50 group-hover:-right-3 group-hover:-top-3 group-hover:size-5 duration-300" />
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
                  <Plus className="size-4 mr-[6px]" />
                  <p>{t('module.qrManagement.additionalField.buttonTriggerTitle')}</p>
                </Button>
              </CustomAddItemDialog>
            </div>
            {/* Button action */}
            <div className="flex items-center justify-start space-x-2">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-destructive hover:text-destructive-foreground min-w-[120px]"
                disabled={!form.formState.isDirty}
                onClick={() =>
                  form.reset({ area: areaOptions[0].value, table: tableOptions[0].value })
                }
              >
                <CircleX className="size-4 mr-[6px]" />
                {t('module.qrManagement.reset')}
              </Button>
              <Button type="submit" className="min-w-[120px]">
                <CirclePlus className="size-4 mr-[6px]" />
                {t('module.qrManagement.create')}
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex items-center justify-center h-full p-4 bg-blue-300">
          <Skeleton className="w-64 h-64" />
        </div>
      </div>
    </div>
  );
};

export default CreateQR;
