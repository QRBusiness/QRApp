import { BUSINESS_OWNER_TABLE } from '@/constains';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type BusinessOwner, columns } from './columns';

export default function BusinessOwnerTable({ data }: { data: BusinessOwner[] }) {
  return <DataTable table_key={BUSINESS_OWNER_TABLE} columns={columns} data={data} />;
}
