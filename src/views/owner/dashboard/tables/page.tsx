import { DASHBOARD_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type DashboardColumn, columns } from './columns';

export default function DashboardTable({ data }: { data: DashboardColumn[] }) {
  return <DataTable table_key={DASHBOARD_TABLE} columns={columns} data={data} />;
}
