import { BUSINESS_TYPE_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type BusinessType, columns } from './columns';

export default function BusinessTypeTable({ data }: { data: BusinessType[] }) {
  return <DataTable table_key={BUSINESS_TYPE_TABLE} columns={columns} data={data} />;
}
