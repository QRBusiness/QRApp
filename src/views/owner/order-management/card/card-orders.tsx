import React from 'react';
import { type OrderResponseProps, useOrders } from '@/services/owner/order-service';
import { Funnel, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CustomVariantsSelect } from '../../menu-management/dialog/custom-variants-select';
import CardOrderItem from './card-order-item';

export const CardOrders = () => {
  const [data, setData] = React.useState<OrderResponseProps[]>([]);
  const { orders } = useOrders();

  React.useEffect(() => {
    if (orders && orders.length > 0) {
      setData(orders);
    }
  }, [orders]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pb-14">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 flex items-start md:items-center justify-start gap-2 flex-col md:flex-row">
        <div className="flex items-center space-x-2">
          <Funnel className="size-4 md:size-5" />
          <p>Filters:</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="min-w-12">Area</Label>
          <CustomVariantsSelect
            options={[
              {
                value: 'all',
                label: 'All Areas',
              },
              {
                value: 'area1',
                label: 'Area 1',
              },
              {
                value: 'area2',
                label: 'Area 2',
              },
              {
                value: 'area3',
                label: 'Area 3',
              },
            ]}
            value="all"
            onChange={(value) => console.log(value)}
          />
        </div>
        <Separator className="mx-2 hidden md:block" orientation="vertical" />
        <div className="flex items-center space-x-2">
          <Label className="min-w-12">Table</Label>
          <CustomVariantsSelect
            options={[
              {
                value: 'all',
                label: 'All Tables',
              },
              {
                value: 'table1',
                label: 'Table 1',
              },
              {
                value: 'table2',
                label: 'Table 2',
              },
              {
                value: 'table3',
                label: 'Table 3',
              },
            ]}
            value="all"
            onChange={(value) => console.log(value)}
          />
        </div>
        <Separator className="mx-2 hidden md:block" orientation="vertical" />
        <div className="flex items-center space-x-2">
          <Label className="min-w-12">Status</Label>
          <CustomVariantsSelect
            options={[
              {
                value: 'unpaid',
                label: 'Unpaid',
              },
              {
                value: 'paid',
                label: 'Paid',
              },
            ]}
            value="unpaid"
            onChange={(value) => console.log(value)}
          />
        </div>
      </div>
      {data.map((order) => (
        <CardOrderItem key={order._id} order={order} />
      ))}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 flex justify-center items-center justify-items-center mt-8">
        <Button>
          <RefreshCcw className="size-4 md:size-5 mr-1" />
          Load More
        </Button>
      </div>
    </div>
  );
};
export default CardOrders;
