import React, { useState } from 'react';
import { MENU_MANAGEMENT, UNAUTHORIZED } from '@/constains';
import { useAreas, useCreateArea } from '@/services/owner/area-service';
import { useBranches } from '@/services/owner/branchService';
import { getTables, useCreateTable } from '@/services/owner/tableService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { CircleX, Download, Info, Plus, Printer, QrCode, X } from 'lucide-react';
import QRCode from 'qrcode';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import CustomAddItemDialog, { type FieldProps } from '@/components/common/custom-additem-dialog';
import CustomSelect from '@/components/common/custom-select';
import { Hint } from '@/components/common/hint';
import { useUserState } from '@/components/common/states/userState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createAdditionalFieldSchema, createAreaSchema, createQRSchema, createTableSchema } from '@/utils/schemas';

interface QRProps {
  link: string;
  area: string;
  table: string;
}

const CreateQR = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { business } = useUserState();
  const [additionalInfo, setAdditionalInfo] = React.useState<any[]>([]);
  const [branchOptions, setBranchOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [areaOptions, setAreaOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [tableOptions, setTableOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState<QRProps>({ link: '', area: '', table: '' });
  const [downloadFormat, setDownloadFormat] = useState('PNG');

  const { branches } = useBranches({ page: 1, limit: 50 });
  const { areas } = useAreas({ page: 1, limit: 50 });
  const { createArea } = useCreateArea();
  const { createTable } = useCreateTable();

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

  React.useEffect(() => {
    if (areas && areas.length > 0) {
      setAreaOptions(
        areas.map((area) => ({
          value: area._id,
          label: area.name,
        }))
      );
    }
  }, [areas]);

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
      image_url: values.image_url,
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

  const handleAreaChange = async (area: string) => {
    form.setValue('area', area);
    form.setValue('table', '');

    const tables = await queryClient.fetchQuery({
      queryKey: ['tablesQuery', area],
      queryFn: () => getTables({ page: 1, limit: 50, area }),
    });

    const tableOptions = tables.map((table: any) => ({
      value: table._id,
      label: table.name,
    }));
    setTableOptions(tableOptions);
  };

  const onSubmit = (values: z.infer<typeof createQRSchema>) => {
    const location = window.location.origin;
    const navigateURL = `${location}/${UNAUTHORIZED}/${business._id}/${MENU_MANAGEMENT}?area=${values.area}&table=${values.table}`;
    QRCode.toDataURL(navigateURL, { errorCorrectionLevel: 'H' })
      .then((url) => {
        setQrCodeImage({ link: url, area: values.area, table: values.table });
      })
      .catch((err) => {
        toast.error(t('module.qrManagement.qrGenerationError'), {
          description: err.message || t('module.qrManagement.qrGenerationErrorDescription'),
        });
      });
    setQrGenerated(true);
    toast.success(t('module.qrManagement.qrGeneratedSuccess'), {
      description: t('module.qrManagement.qrGeneratedSuccessDescription'),
    });
    onCancel();
  };

  const onCancel = () => {
    form.reset({
      branch: '',
      area: '',
      table: '',
    });
    setAdditionalInfo([]);
  };

  const handleDownLoadQR = () => {
    if (!qrCodeImage) {
      toast.error(t('module.qrManagement.qrDownloadError'), {
        description: t('module.qrManagement.qrDownloadErrorDescription'),
      });
      return;
    }
    const areaName = areaOptions.find((area) => area.value === qrCodeImage.area)?.label || 'unknown-area';
    const tableName = tableOptions.find((table) => table.value === qrCodeImage.table)?.label || 'unknown-table';
    const fileName = `qr-code-${areaName}-${tableName}`;

    if (downloadFormat === 'PNG') {
      const link = document.createElement('a');
      link.href = qrCodeImage.link;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (downloadFormat === 'SVG') {
      const navigateURL = `${location}/${UNAUTHORIZED}/${business._id}/${MENU_MANAGEMENT}?area=${qrCodeImage.area}&table=${qrCodeImage.table}`;
      QRCode.toString(navigateURL, {
        errorCorrectionLevel: 'H',
        type: 'svg',
      })
        .then((svgString) => {
          // Tạo blob SVG
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName}.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);

          toast.success(t('module.qrManagement.qrDownloadSuccess'), {
            description: t('module.qrManagement.qrDownloadSuccessDescription'),
          });
        })
        .catch((err) => {
          toast.error(t('module.qrManagement.qrDownloadError'), {
            description: err.message || t('module.qrManagement.qrDownloadErrorDescription'),
          });
        });
    }
  };

  return (
    <div className="container mx-auto w-full h-full grid grid-cols-1 lg:grid-cols-6 gap-4">
      {/* Left pane wrapper */}
      <Card className="flex flex-col lg:col-span-4 items-start justify-between w-full p-4 space-y-4 rounded border shadow-md flex-1 mr-4 h-full">
        {/* Title and Description */}
        <div className="flex flex-col items-start justify-start space-y-2">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('module.qrManagement.table.title')}</h4>
          <p className="text-muted-foreground text-sm">{t('module.qrManagement.table.description')}</p>
        </div>
        <div className="flex flex-col flex-1 lg:flex-row items-start justify-start space-y-4 lg:space-y-0 lg:space-x-4 w-full h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
                          onFieldChange={field.onChange}
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
                          value={field.value || ''}
                          placeholder={t('module.area.placeholder')}
                        />
                        <CustomAddItemDialog
                          title={t('module.qrManagement.addAreaField.title')}
                          description={t('module.qrManagement.addAreaField.description')}
                          schema={createAreaSchema}
                          onSubmit={handleCreateArea}
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
                          placeholder={t('module.table.placeholder')}
                          disabled={form.getValues('area') === ''}
                        />
                        <CustomAddItemDialog
                          title={t('module.qrManagement.addTableField.title')}
                          description={t('module.qrManagement.addTableField.description')}
                          schema={createTableSchema}
                          onSubmit={handleCreateTable}
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
                <div className="grid grid-cols-3 gap-2 w-full">
                  {additionalInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between space-x-2 px-3 py-2 shadow-md group flex-1 border rounded-md group win-w-fit"
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
              <div className="flex items-center justify-end space-x-2">
                {/* Reset and Submit buttons */}
                {form.formState.isDirty && (
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-destructive hover:text-destructive-foreground min-w-[120px]"
                    disabled={!form.formState.isDirty}
                    onClick={onCancel}
                  >
                    <CircleX className="size-5 mr-[6px]" />
                    {t('module.qrManagement.reset')}
                  </Button>
                )}

                <Button type="submit" className="min-w-[120px]" disabled={!form.formState.isDirty}>
                  <QrCode className="size-5 mr-[6px]" />
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
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{t('module.qrManagement.preview.title')}</h4>
          <p className="text-sm text-muted-foreground">{t('module.qrManagement.preview.description')}</p>
        </div>
        {/* QR Code Preview */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
          <div
            className={`w-64 h-64 flex items-center justify-center border-2 ${qrGenerated ? 'border' : 'border-dashed border'} rounded-lg mb-4`}
          >
            {qrGenerated ? (
              <div className="w-56 h-56 p-2">
                <img src={qrCodeImage.link || ''} alt="Generated QR Code" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="text-center p-4 flex flex-col items-center justify-center">
                <QrCode className="size-16 mb-2 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">{t('module.qrManagement.preview.position')}</p>
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
                <SelectItem value="SVG">SVG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Action Buttons */}
          <Button
            className="w-full  whitespace-nowrap cursor-pointer"
            disabled={!qrGenerated}
            onClick={handleDownLoadQR}
          >
            <Download className="mr-2" /> {t('module.qrManagement.preview.downloadButton')}
          </Button>

          <Button variant="outline" className="w-full  whitespace-nowrap cursor-pointer" disabled={!qrGenerated}>
            <Printer className="mr-2" /> {t('module.qrManagement.preview.printButton')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateQR;
