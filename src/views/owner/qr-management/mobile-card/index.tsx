import { useState } from 'react';
import { CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import MobileCreateDialog from '../create/mobile-create-dialog';
import MobileCardItem, { type MobileCardItemProps } from './mobileCardItem';

export const MobileTable = () => {
  const cardItems: MobileCardItemProps[] = [
    {
      id: 'TBL-2025-0642',
      table: 'Conference Room A',
      area: 'East Wing, 3rd Floor',
      status: 'Ordering',
      available: true,
      createdAt: '2025-06-08T14:30:00Z',
    },
    {
      id: 'TBL-2025-0643',
      table: 'Executive Meeting Room',
      area: 'West Wing, 5th Floor',
      status: 'Staff Call',
      available: false,
      createdAt: '2025-06-07T09:15:00Z',
    },
    {
      id: 'TBL-2025-0644',
      table: 'Collaboration Space',
      area: 'North Building, Ground Floor',
      status: 'Paid',
      available: true,
      createdAt: '2025-06-09T10:45:00Z',
    },
    {
      id: 'TBL-2025-0645',
      table: 'Training Room B',
      area: 'South Wing, 2nd Floor',
      status: 'Cancelled',
      available: true,
      createdAt: '2025-06-05T16:20:00Z',
    },
  ];
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="px-4 pb-4 flex-1 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {t('module.qrManagement.table.tablesCount', { tablesCount: cardItems.length })}
        </h2>
        <MobileCreateDialog
          open={open}
          onOpenChange={setOpen}
          title="Create New QR Code"
          description="Fill in the details to create a new QR code."
          onSubmit={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          <Button variant="default" size="sm" className="flex items-center gap-2">
            <CirclePlus className="text-white" />
            {t('module.qrManagement.createSessionShortKey')}
          </Button>
        </MobileCreateDialog>
      </div>

      <div className="space-y-4 w-full px-0 mx-0">
        {cardItems.map((item) => (
          <MobileCardItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
export default MobileTable;
