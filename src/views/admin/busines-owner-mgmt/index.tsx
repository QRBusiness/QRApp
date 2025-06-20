import { BUSINESS_OWNER_MANAGEMENT } from '@/constains';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { BusinessOwner } from './table/columns';
import BusinessOwnerTable from './table/page';

const BusinessOwnerManagement = () => {
  const navigate = useNavigate();
  const data: BusinessOwner[] = [
    {
      id: '1',
      name: 'John Doe',
      address: '123 Main St',
      phone: '123-456-7890',
      role: 'Owner',
      permissions: [],
      username: 'johndoe',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      address: '456 Oak Ave',
      phone: '987-654-3210',
      role: 'Manager',
      permissions: [],
      username: 'janesmith',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Alice Johnson',
      address: '789 Pine Rd',
      phone: '555-123-4567',
      role: 'Owner',
      permissions: [],
      username: 'alicej',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Bob Williams',
      address: '321 Maple St',
      phone: '444-555-6666',
      role: 'Admin',
      permissions: [],
      username: 'bobw',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Carol Lee',
      address: '654 Cedar Ave',
      phone: '222-333-4444',
      role: 'Manager',
      permissions: [],
      username: 'caroll',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  return (
    <div className="container mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end">
        <Button variant="default" onClick={() => navigate(`../${BUSINESS_OWNER_MANAGEMENT}/create`)}>
          <CirclePlus className="mr-2 size-4 md:size-5" />
          Add Business Owner
        </Button>
      </div>
      <BusinessOwnerTable data={data} />
    </div>
  );
};

export default BusinessOwnerManagement;
