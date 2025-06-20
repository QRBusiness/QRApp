import { BUSINESS_OWNER_MANAGEMENT } from '@/constains';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { BusinessType } from './table/columns';
import BusinessTable from './table/page';

const BusinessManagement = () => {
  const navigate = useNavigate();
  const data: BusinessType[] = [
    {
      id: '1',
      name: 'ABC Retailers',
      businessType: 'Retail',
      address: '123 Main St',
      contact: '123-456-7890',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'XYZ Services',
      businessType: 'Services',
      address: '456 Market Ave',
      contact: '987-654-3210',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Fresh Foods',
      businessType: 'Food & Beverage',
      address: '789 Food Ct',
      contact: '555-123-4567',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Tech Solutions',
      businessType: 'IT',
      address: '321 Silicon Blvd',
      contact: '222-333-4444',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Green Gardens',
      businessType: 'Agriculture',
      address: '654 Greenway Dr',
      contact: '888-777-6666',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  return (
    <div className="container mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end">
        <Button variant="default" onClick={() => navigate(`../${BUSINESS_OWNER_MANAGEMENT}/create`)}>
          <CirclePlus className="mr-2 size-4 md:size-5" />
          Add new Business
        </Button>
      </div>
      <BusinessTable data={data} />
    </div>
  );
};

export default BusinessManagement;
