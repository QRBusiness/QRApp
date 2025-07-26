import React from 'react';
import { STAFF_ROLE } from '@/constants';
import { useUsers } from '@/services/admin/business-owner-service';
import { getAreas } from '@/services/owner/area-service';
import { useBranches } from '@/services/owner/branch-service';
import { useOrderReport } from '@/services/owner/order-service';
import { useProducts } from '@/services/owner/product-services';
import { getTables } from '@/services/owner/table-service';
import { ChevronLeft, FunnelPlus, FunnelX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CalendarComponent } from '@/components/common/calendar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { CustomVariantsSelect } from '../menu-management/dialog/custom-variants-select';
import CardBadge from './card-badge';
import DashboardTable from './tables/page';

const Dashboard = () => {
  const { t } = useTranslation();
  const [startDateOpen, setStartDateOpen] = React.useState<boolean>(false);
  const [endDateOpen, setEndDateOpen] = React.useState<boolean>(false);
  const now = new Date();

  const [filter, setFilter] = React.useState({
    branch: '',
    area: '',
    service_unit: '',
    staff: '',
    product: '',
    method: '',
    start_date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
  });
  const { orders, total_amount, total_count } = useOrderReport({
    branch: filter.branch,
    area: filter.area,
    service_unit: filter.service_unit,
    staff: filter.staff,
    product: filter.product,
    method: filter.method as 'Cash' | 'Bank',
    start_date: filter.start_date,
    end_date: filter.end_date,
  });

  const formatedData = orders.map((order) => ({
    _id: order._id,
    branch: order.branch.name,
    area: order.area.name,
    service_unit: order.service_unit.name,
    guess_name: order.request.guest_name,
    payment_method: order.payment_method,
    amount: order.items.map((item) => item.price * item.quantity).reduce((a, b) => a + b, 0),
    status: order.status,
    created_at: new Date(order.created_at).toLocaleDateString(),
    updated_at: new Date(order.updated_at).toLocaleDateString(),
  }));

  const { branches } = useBranches({ page: 1, limit: 50 });
  const { products } = useProducts({ category: '', sub_category: '' });
  const { users } = useUsers({ page: 1, limit: 50, role: STAFF_ROLE });
  const branchOptions = branches.map((branch) => ({
    value: branch._id,
    label: branch.name,
  }));
  const [areaOptions, setAreaOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [tableOptions, setTableOptions] = React.useState<{ value: string; label: string }[]>([]);
  const paymentMethodOptions = [
    { value: 'Cash', label: t('module.filter.paymentMethod.cash') },
    { value: 'Bank', label: t('module.filter.paymentMethod.bank') },
  ];
  const productOptions = products.map((product) => ({
    value: product._id,
    label: product.name,
  }));
  const staffOptions = users.map((user) => ({
    value: user._id,
    label: user.name,
  }));

  const handleBranchChange = async (value: string) => {
    setFilter((prev) => ({ ...prev, branch: value }));
    if (value == '') {
      setAreaOptions([]);
      setTableOptions([]);
      return;
    }
    const areaResponse = await getAreas({
      page: 1,
      limit: 50,
      branch: value,
    });
    const areaOptions = areaResponse.map((area) => ({
      value: area._id,
      label: area.name,
    }));
    setAreaOptions(areaOptions);
  };

  const handleAreaChange = async (value: string) => {
    setFilter((prev) => ({ ...prev, area: value }));
    if (value === '') {
      setTableOptions([]);
      return;
    }
    // Fetch tables based on selected area
    const tablesResponse = await getTables({ page: 1, limit: 50, area: value });
    const tableOptions = tablesResponse.map((table) => ({
      value: table._id,
      label: table.name,
    }));
    setTableOptions(tableOptions);
  };

  const handleClearFilter = () => {
    setFilter({
      branch: '',
      area: '',
      service_unit: '',
      staff: '',
      product: '',
      method: '',
      start_date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
    });
    setAreaOptions([]);
    setTableOptions([]);
  };

  return (
    <div className="w-full mx-auto space-y-4 px-2 md:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <CardBadge
          label="Total Revenue"
          total={total_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          ratio="+0%"
          trend="up"
        />
        <CardBadge label="Total Orders" total={total_count.toString()} ratio="+0%" trend="up" />
        <CardBadge label="Total Staff of Business" total={users.length.toString()} ratio="+0%" trend="up" />
        <CardBadge label="Total Products" total={products.length.toString()} ratio="+0%" trend="up" />
      </div>
      <Collapsible className="group/collapsible" defaultOpen={false} key={'dashboard-filter-collapsible'}>
        <CollapsibleTrigger asChild>
          <Button variant={'outline'}>
            {t('module.dashboard.toggleFilter')}
            <ChevronLeft className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4">
          {/* filters */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4 flex items-start justify-start gap-2 flex-col p-3 border rounded-lg">
            <div className="flex items-center justify-between space-x-2 w-full">
              <div className="flex items-center space-x-2">
                <FunnelPlus className="size-4 md:size-5" />
                <Label className="font-semibold text-base ">{t('module.filter.title')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearFilter}
                  disabled={
                    filter.branch === '' &&
                    filter.area === '' &&
                    filter.service_unit === '' &&
                    filter.staff === '' &&
                    filter.product === '' &&
                    filter.method === '' &&
                    filter.start_date === '' &&
                    filter.end_date === ''
                  }
                >
                  <FunnelX className="size-4 md:size-5" />
                  {t('module.filter.button.clear')}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 w-full items-center justify-between flex-wrap gap-3">
              <div className="flex flex-col items-start justify-center space-y-2">
                {/* Branch Filter */}
                <Label className="text-muted-foreground">{t('module.filter.branch.label')}</Label>
                <CustomVariantsSelect
                  options={branchOptions}
                  value={filter.branch}
                  onChange={handleBranchChange}
                  placeholder={t('module.filter.branch.placeholder')}
                />
              </div>
              {/* Area Filter */}
              <div className="flex flex-col items-start justify-center space-y-2">
                <Label className="text-muted-foreground">{t('module.filter.area.label')}</Label>
                <CustomVariantsSelect
                  options={areaOptions}
                  value={filter.area}
                  onChange={handleAreaChange}
                  placeholder={t('module.filter.area.placeholder')}
                  disabled={filter.branch === ''}
                />
              </div>
              {/* Service Unit / Table Filter */}
              <div className="flex flex-col items-start justify-center space-y-2">
                <Label className="text-muted-foreground">{t('module.filter.table.label')}</Label>
                <CustomVariantsSelect
                  options={tableOptions}
                  value={filter.service_unit}
                  onChange={(value: string) => setFilter((prev) => ({ ...prev, service_unit: value }))}
                  disabled={filter.area === ''}
                  placeholder={t('module.filter.table.placeholder')}
                />
              </div>
              {/* Payment Method Filter */}
              <div className="flex flex-col items-start justify-center space-y-2">
                <Label className="text-muted-foreground">{t('module.filter.paymentMethod.label')}</Label>
                <CustomVariantsSelect
                  options={paymentMethodOptions}
                  value={filter.method}
                  onChange={(value: string) => setFilter((prev) => ({ ...prev, method: value }))}
                  placeholder={t('module.filter.paymentMethod.placeholder')}
                />
              </div>
              {/* Product Filter */}
              <div className="flex flex-col items-start justify-center space-y-2">
                <Label className="text-muted-foreground">{t('module.filter.product.label')}</Label>
                <CustomVariantsSelect
                  options={productOptions}
                  value={filter.product}
                  onChange={(value: string) => setFilter((prev) => ({ ...prev, product: value }))}
                  placeholder={t('module.filter.product.placeholder')}
                />
              </div>
              {/* Staff Filter */}
              <div className="flex flex-col items-start justify-center space-y-2">
                <Label className="text-muted-foreground">{t('module.filter.staff.label')}</Label>
                <CustomVariantsSelect
                  options={staffOptions}
                  value={filter.staff}
                  onChange={(value: string) => setFilter((prev) => ({ ...prev, staff: value }))}
                  placeholder={t('module.filter.staff.placeholder')}
                />
              </div>
              {/* Start Date Filter */}
              <div className="flex flex-col items-start justify-center space-y-2">
                <Label className="text-muted-foreground">{t('module.filter.startDate.label')}</Label>
                <CalendarComponent
                  openDialog={startDateOpen}
                  setOpenDialog={setStartDateOpen}
                  date={new Date(filter.start_date)}
                  setDate={(date: Date | undefined) =>
                    setFilter((prev) => ({ ...prev, start_date: date?.toISOString() || '' }))
                  }
                />
              </div>
              {/* End Date Filter */}
              <div className="flex flex-col items-start justify-center space-y-2">
                <Label className="text-muted-foreground">{t('module.filter.endDate.label')}</Label>
                <CalendarComponent
                  openDialog={endDateOpen}
                  setOpenDialog={setEndDateOpen}
                  date={new Date(filter.end_date)}
                  setDate={(date: Date | undefined) =>
                    setFilter((prev) => ({ ...prev, end_date: date?.toISOString() || '' }))
                  }
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      {/* Other dashboard components can be added here */}
      <DashboardTable data={formatedData} />
    </div>
  );
};
``;

export default Dashboard;
