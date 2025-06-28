import { BUSINESS_OWNER_TABLE } from '@/constains';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type UserProps, columns } from './columns';

export default function StaffTable({ data }: { data: UserProps[] }) {
  return <DataTable table_key={BUSINESS_OWNER_TABLE} columns={columns} data={data} />;
}
