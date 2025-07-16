import React from 'react';
import { useAreas } from '@/services/owner/area-service';
import { type OrderResponseProps, useOrders } from '@/services/owner/order-service';
import { getTables } from '@/services/owner/table-service';
import { FunnelPlus, FunnelX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CustomVariantsSelect } from '../../menu-management/dialog/custom-variants-select';
import CardOrderItem from './card-order-item';

export const CardOrders = () => {
  const { t } = useTranslation();
  const { areas } = useAreas({ page: 1, limit: 50 });
  const [selectedArea, setSelectedArea] = React.useState<string>('');
  const [selectedTable, setSelectedTable] = React.useState<string>('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('Unpaid');
  const { orders, isLoading, refetch } = useOrders({
    area: selectedArea,
    table: selectedTable,
    status: selectedStatus,
  });
  const data = orders as OrderResponseProps[];
  const [tableOptions, setTableOptions] = React.useState<{ value: string; label: string }[]>([]);

  const areaOptions = React.useMemo(() => {
    if (!areas || areas.length === 0) {
      return [];
    }
    return areas.map((area) => ({
      value: area._id,
      label: area.name,
    }));
  }, [areas]);
  const statusOptions = React.useMemo(() => {
    return [
      {
        value: 'Unpaid',
        label: 'Unpaid',
      },
      {
        value: 'Paid',
        label: 'Paid',
      },
    ];
  }, []);

  const handleAreaChange = async (value: string) => {
    setSelectedArea(value);
    if (value === '') {
      setTableOptions([]);
      setSelectedTable('');
      return;
    }
    const area = areas.find((area) => area._id === value);
    const tables = await getTables({ page: 1, limit: 50, area: area?._id });

    const tableOptions = tables.map((table: any) => ({
      value: table._id,
      label: table.name,
    }));
    setSelectedTable('');
    setTableOptions(tableOptions);
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (selectedArea !== '' || selectedTable !== '' || selectedStatus !== '') {
        refetch();
      }
    }, 3000);
    return () => clearTimeout(timeout); // Refetch every 3 seconds
  }, [selectedArea, selectedTable, selectedStatus]);

  const handleClearFilters = () => {
    setSelectedArea('');
    setSelectedStatus('');
    setSelectedTable('');
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-14">
      {/* filters */}
      <div className="col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4 flex items-start justify-start gap-2 flex-col p-3 border rounded-lg">
        <div className="flex items-center justify-between space-x-2 w-full">
          <div className="flex items-center space-x-2">
            <FunnelPlus className="size-4 md:size-5" />
            <Label className="font-semibold text-base ">Filters Options</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearFilters}
              disabled={selectedArea === '' && selectedTable === '' && selectedStatus === ''}
            >
              <FunnelX className="size-4 md:size-5" />
              Clear Filters
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-3 w-full items-center justify-between flex-wrap gap-2">
          <div className="flex flex-col items-start justify-center space-y-2">
            <Label className="text-muted-foreground">Area Filter</Label>
            <CustomVariantsSelect
              options={areaOptions}
              value={selectedArea}
              onChange={handleAreaChange}
              placeholder={t('module.placeholders.selectArea')}
            />
          </div>

          <div className="flex flex-col items-start justify-center space-y-2">
            <Label className="text-muted-foreground">Table Filter</Label>
            <CustomVariantsSelect
              options={tableOptions}
              value={selectedTable}
              onChange={setSelectedTable}
              disabled={selectedArea === ''}
              placeholder={t('module.placeholders.selectTable')}
            />
          </div>

          <div className="flex flex-col items-start justify-center space-y-2">
            <Label className="text-muted-foreground">Status Filter</Label>
            <CustomVariantsSelect
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder={t('module.placeholders.selectStatus')}
            />
          </div>
        </div>
      </div>
      {data.length === 0 && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 flex justify-center items-center h-96">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      )}
      {data.map((order) => (
        <CardOrderItem key={order._id} order={order} />
      ))}
      {/* {data.length > 0 && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 flex justify-center items-center justify-items-center mt-8">
          <Button>
            <RefreshCcw className="size-4 md:size-5 mr-1" />
            Load More
          </Button>
        </div>
      )} */}
    </div>
  );
};
export default CardOrders;
