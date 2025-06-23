import React from 'react';
import { BUSINESS_OWNER_MANAGEMENT, OWNER_ROLE } from '@/constains';
import { useBusinessOwners } from '@/services/admin/business-owner-service';
import { CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { BusinessOwner } from './table/columns';
import BusinessOwnerTable from './table/page';

const BusinessOwnerManagement = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = React.useState<BusinessOwner[]>([]);
  const { businessOwners, isLoading } = useBusinessOwners({ page: 1, limit: 50 });

  React.useEffect(() => {
    if (businessOwners.length > 0) {
      setData(
        businessOwners.map((owner) => ({
          id: owner._id,
          name: owner.name,
          username: owner.username,
          email: owner.email,
          phone: owner.phone,
          address: owner.address,
          role: owner.role,
          available: owner.available,
          created_at: owner.created_at,
          updated_at: owner.updated_at,
        }))
      );
    }
  }, [businessOwners]);

  return (
    <div className="container mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end">
        <Button
          variant="default"
          onClick={() => navigate(`../${BUSINESS_OWNER_MANAGEMENT}/create`)}
          disabled={isLoading}
        >
          <CirclePlus className="mr-2 size-4 md:size-5" />
          {t('module.businessOwner.createNew')}
        </Button>
      </div>
      <BusinessOwnerTable data={data.filter((owner) => owner.role === OWNER_ROLE)} />
    </div>
  );
};

export default BusinessOwnerManagement;
