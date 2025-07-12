import React, { useEffect } from 'react';
import { type AreaResponse, getAreas } from '@/services/owner/area-service';
import { useBranches } from '@/services/owner/branch-service';
import { getTables } from '@/services/owner/table-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, CircleX } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createOrderRequestSchema } from '@/utils/schemas';

interface createOrderRequestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof createOrderRequestSchema>) => void;
  onCancel?: () => void;
}

const CreateNewOrderRequest = ({ open, onOpenChange, onSubmit, onCancel }: createOrderRequestProps) => {
  const initialData = {
    branch: '',
    area: '',
    service_unit: '',
    guest_name: '',
  };
  const { t } = useTranslation();

  const { branches } = useBranches({ page: 1, limit: 50 });
  const branchOptions = branches.map((branch) => ({
    value: branch._id,
    label: branch.name,
  }));

  const [areaOptions, setAreaOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [tableOptions, setTableOptions] = React.useState<{ value: string; label: string }[]>([]);

  const form = useForm<z.infer<typeof createOrderRequestSchema>>({
    resolver: zodResolver(createOrderRequestSchema),
    defaultValues: initialData,
  });

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

  const handleBranchChange = async (branchId: string) => {
    form.setValue('branch', branchId);
    form.setValue('area', '');
    form.setValue('service_unit', '');

    const areas = await getAreas({ page: 1, limit: 50, branch: branchId });
    const areaOptions = areas.map((area: AreaResponse) => ({
      value: area._id,
      label: area.name,
    }));
    setAreaOptions(areaOptions);
  };
  const handleAreaChange = async (area: string) => {
    form.setValue('area', area);
    form.setValue('service_unit', '');

    const tables = await getTables({ page: 1, limit: 50, area });

    const tableOptions = tables.map((table: any) => ({
      value: table._id,
      label: table.name,
    }));
    setTableOptions(tableOptions);
  };

  const onSubmitForm = async (data: z.infer<typeof createOrderRequestSchema>) => {
    onSubmit && onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl overflow-y-scroll max-h-9/10">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-2">
            <Bell className="size-5 mr-[6px]" />
            Create New Order Request
          </DialogTitle>
          <DialogDescription>Fill in the details to create a new order request.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-6 w-full"
            key={open ? JSON.stringify(initialData) : 'closed'}
          >
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
                    </div>
                  </FormControl>
                  <FormDescription>{t('module.area.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_unit"
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
                        value={field.value || ''}
                        placeholder={t('module.table.placeholder')}
                        onFieldChange={(props) => {
                          field.onChange(props);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>{t('module.table.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guest_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('module.guestUser.field.name.label')}
                    <p className="text-red-700">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('module.guestUser.field.name.placeholder')}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>{t('module.guestUser.field.name.description')}</FormDescription>
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
                <Bell className="size-5 mr-[6px]" /> Confirm Order and Checkout
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewOrderRequest;
