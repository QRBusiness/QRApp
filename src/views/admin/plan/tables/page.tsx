import { PLAN_MANAGEMENT_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type PlanType, columns } from './columns';

export default function PlanManagementTable({ data }: { data: PlanType[] }) {
  return <DataTable table_key={PLAN_MANAGEMENT_TABLE} columns={columns} data={data} />;
}
