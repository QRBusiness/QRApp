import React from 'react';
import { useBusinessTypes, useCreateBusinessType } from '@/services/admin/business-type-service';
import { CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type z from 'zod';
import { Button } from '@/components/ui/button';
import type { createBusinessTypeSchema } from '@/utils/schemas';
import CreateNewBusinessType from './dialog/create-new-business-type';
import type { BusinessType } from './table/columns';
import BusinessTypeTable from './table/page';

const BusinessTypeManagement = () => {
  const { t } = useTranslation();
  const [data, setData] = React.useState<BusinessType[]>([]);
  const [open, setOpen] = React.useState(false);
  const { businessTypes } = useBusinessTypes({ page: 1, limit: 50 });
  const { createBusinessType } = useCreateBusinessType();

  const onSubmit = async (formData: z.infer<typeof createBusinessTypeSchema>) => {
    await createBusinessType(formData);
    // refetchBusinessTypes();
  };

  // Update data state when businessTypes changes
  // This ensures that the table reflects the latest data from the API
  React.useEffect(() => {
    if (businessTypes.length > 0) {
      setData(
        businessTypes.map((type) => ({
          id: type._id,
          name: type.name,
          description: type.description,
          created_at: type.created_at,
          updated_at: type.updated_at,
        }))
      );
    }
  }, [businessTypes]);

  return (
    <div className="w-full mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end mr-2 xl:mr-0">
        <CreateNewBusinessType open={open} onOpenChange={setOpen} onSubmit={onSubmit}>
          <Button variant="default">
            <CirclePlus className="mr-2 size-4 md:size-5" />
            {t('module.businessType.button.create')}
          </Button>
        </CreateNewBusinessType>
      </div>
      <BusinessTypeTable data={data} />
    </div>
  );
};
export default BusinessTypeManagement;
