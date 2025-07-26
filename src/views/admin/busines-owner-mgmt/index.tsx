import React from 'react';
import { BUSINESS_OWNER_MANAGEMENT, OWNER_ROLE } from '@/constants';
import { useUsers } from '@/services/admin/business-owner-service';
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
  const { users, isLoading } = useUsers({ page: 1, limit: 50, role: OWNER_ROLE });

  React.useEffect(() => {
    if (users.length > 0) {
      setData(
        users.map((user) => ({
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          available: user.available,
          created_at: user.created_at,
          updated_at: user.updated_at,
        }))
      );
    }
  }, [users]);

  return (
    <div className="w-full mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end mr-2 xl:mr-0">
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
