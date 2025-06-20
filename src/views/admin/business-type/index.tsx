import React from 'react';
import { CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateNewBusinessType from './dialog/create-new-business-type';
import BusinessTypeTable from './table/page';

const BusinessTypeManagement = () => {
  const dummyData = [
    {
      id: '1',
      name: 'Restaurant',
      description: 'A place where meals are served to customers.',
      created_at: '2023-01-01T12:00:00Z',
      updated_at: '2023-01-02T12:00:00Z',
    },
    {
      id: '2',
      name: 'Cafe',
      description: 'A small restaurant selling light meals and drinks.',
      created_at: '2023-01-03T12:00:00Z',
      updated_at: '2023-01-04T12:00:00Z',
    },
  ];
  const [open, setOpen] = React.useState(false);

  return (
    <div className="container mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end">
        <CreateNewBusinessType open={open} onOpenChange={setOpen}>
          <Button variant="default">
            <CirclePlus className="mr-2 size-4 md:size-5" />
            Add Business Type
          </Button>
        </CreateNewBusinessType>
      </div>
      <BusinessTypeTable data={dummyData} />
    </div>
  );
};
export default BusinessTypeManagement;
