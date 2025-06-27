import { useEffect, useState } from 'react';
import { useTables } from '@/services/owner/table-service';
import { CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import MobileCreateDialog from '../create/mobile-create-dialog';
import MobileCardItem, { type MobileCardItemProps } from './mobileCardItem';

export const MobileTable = () => {
  const [data, setData] = useState<MobileCardItemProps[]>([]);

  const { tables } = useTables({ page: 1, limit: 50 });

  useEffect(() => {
    if (tables) {
      const formattedData = tables.map((table, index) => ({
        id: String(index + 1), // Using index as ID for display purposes
        table: table.name,
        table_id: table._id, // Assuming table ID is the same as _id
        area: table.area.name,
        area_id: table.area._id, // Assuming area ID is the same as _id
        available: typeof table.available === 'boolean' ? table.available : true,
        branch: table.area.branch.name,
        created_at: table.created_at,
        updated_at: table.updated_at,
      }));
      setData(formattedData);
    }
  }, [tables]);

  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="px-4 pb-8 flex-1 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {t('module.qrManagement.table.tablesCount', { tablesCount: data.length })}
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
        {data.map((item) => (
          <MobileCardItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
export default MobileTable;
