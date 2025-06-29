import React from 'react';
import { BUSINESS_OWNER_MANAGEMENT } from '@/constants';
import { useBusiness } from '@/services/admin/business-service';
import { CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { BusinessType } from './table/columns';
import BusinessTable from './table/page';

const BusinessManagement = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = React.useState<BusinessType[]>([]);
  const { business: businesses } = useBusiness({ page: 1, limit: 50 });

  React.useEffect(() => {
    if (businesses.length > 0) {
      setData(
        businesses.map((business) => ({
          id: business._id,
          name: business.name,
          created_at: business.created_at,
          updated_at: business.updated_at,
          business_type: business.business_type.name,
          address: business.address,
          contact: business.contact,
          tax_code: business.tax_code,
          available: business.available,
        }))
      );
    }
  }, [businesses]);

  return (
    <div className="container mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end">
        <Button variant="default" onClick={() => navigate(`../${BUSINESS_OWNER_MANAGEMENT}/create`)}>
          <CirclePlus className="mr-2 size-4 md:size-5" />
          {t('module.business.createNew')}
        </Button>
      </div>
      <BusinessTable data={data} />
    </div>
  );
};

export default BusinessManagement;
