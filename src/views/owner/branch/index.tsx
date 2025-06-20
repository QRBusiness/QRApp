import { CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BranchTypeTable from './table';
import type { BranchType } from './table/columns';

const BranchManagement = () => {
  const dummyData: BranchType[] = [
    {
      id: '1',
      name: 'Restaurant',
      address: '123 Main St',
      contact: '555-1234',
      created_at: '2023-01-01T12:00:00Z',
      updated_at: '2023-01-02T12:00:00Z',
    },
    {
      id: '2',
      name: 'Cafe',
      address: '456 Elm St',
      contact: '555-5678',
      created_at: '2023-01-03T12:00:00Z',
      updated_at: '2023-01-04T12:00:00Z',
    },
  ];
  return (
    <div className="container mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end">
        <Button variant="default">
          <CirclePlus className="mr-2 size-4 md:size-5" />
          Add New Branch
        </Button>
      </div>
      <BranchTypeTable data={dummyData} />
    </div>
  );
};

export default BranchManagement;
