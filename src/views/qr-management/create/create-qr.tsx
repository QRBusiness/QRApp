import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, Download, Info, Plus, Printer, QrCode, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import CustomAddItemDialog, { type FieldProps } from '@/components/common/custom-additem-dialog';
import CustomSelect from '@/components/common/custom-select';
import { Hint } from '@/components/common/hint';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [qrGenerated, setQrGenerated] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('PNG');

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
      type: 'select',
      options: areaOptions.map((area) => ({
        value: area.value,
        label: area.label,
      })),
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
    <div className="container mx-auto w-full h-full grid grid-cols-1 lg:grid-cols-6 gap-4 ">
      {/* Left pane wrapper */}
      <Card className="flex flex-col lg:col-span-4 items-start justify-between w-full p-4 space-y-8 rounded border shadow-md flex-1 mr-4 h-full">
        {/* Title and Description */}
        <div className="flex flex-col items-start justify-start space-y-2">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {t('module.qrManagement.table.title')}
          </h4>
          <p className="text-muted-foreground text-sm">
            {t('module.qrManagement.table.description')}
          </p>
        </div>
        <div className="flex flex-col flex-1 lg:flex-row items-start justify-start space-y-4 lg:space-y-0 lg:space-x-4 w-full h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                          onSubmit={(values) => {
                            console.log('Table created:', values);
                          }}
                          fields={addTableFields}
                        >
                          <Button type="button" variant="default">
                            <Plus className="size-4 md:mr-[6px]" />
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
                <div className="grid grid-cols-5 gap-2 w-full">
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
                        <X className="size-4" />
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
                      <Plus className="size-4 mr-[6px]" />
                      <p>{t('module.qrManagement.additionalField.buttonTriggerTitle')}</p>
                    </Button>
                  </CustomAddItemDialog>
                </div>
              </div>

              {/* Button action */}
              <div className="flex items-center justify-end space-x-2">
                {/* Reset and Submit buttons */}
                {form.formState.isDirty && (
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
                )}

                <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                  <QrCode className="size-4 mr-[6px]" />
                  {t('module.qrManagement.create')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
      {/* Right pane wrapper */}
      <Card className="p-6 h-full w-full flex flex-col lg:col-span-2">
        <div className="flex flex-col items-start justify-start mb-4 space-y-2">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {t('module.qrManagement.preview.title')}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t('module.qrManagement.preview.description')}
          </p>
        </div>
        {/* QR Code Preview */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
          <div
            className={`w-64 h-64 flex items-center justify-center border-2 ${qrGenerated ? 'border' : 'border-dashed border'} rounded-lg mb-4`}
          >
            {qrGenerated ? (
              <div className="w-56 h-56 p-2">
                <img src="" alt="Generated QR Code" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="text-center p-4 flex flex-col items-center justify-center">
                <QrCode className="size-16 mb-2 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  {t('module.qrManagement.preview.position')}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Download Format */}
        <div className="space-y-4 mt-auto">
          <div className="flex justify-between items-center">
            <Label htmlFor="format" className="text-sm font-medium">
              {t('module.qrManagement.preview.downloadFormat')}
              <span className="text-red-700">*</span>
            </Label>
            <Select value={downloadFormat} onValueChange={setDownloadFormat}>
              <SelectTrigger id="format" className="w-32">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PNG">PNG</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="SVG">SVG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Action Buttons */}
          <Button
            className="w-full !rounded-button whitespace-nowrap cursor-pointer"
            disabled={!qrGenerated}
          >
            <Download className="mr-2" /> {t('module.qrManagement.preview.downloadButton')}
          </Button>

          <Button
            variant="outline"
            className="w-full !rounded-button whitespace-nowrap cursor-pointer"
            disabled={!qrGenerated}
          >
            <Printer className="mr-2" /> {t('module.qrManagement.preview.printButton')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateQR;
