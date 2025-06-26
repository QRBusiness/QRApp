import { BUSINESS_TABLE } from '@/constains';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type BusinessType, columns } from './columns';

export default function BusinessTable({ data }: { data: BusinessType[] }) {
  return <DataTable table_key={BUSINESS_TABLE} columns={columns} data={data} />;
}
