import { STAFF_MANAGEMENT_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type UserProps, columns } from './columns';

export default function StaffTable({ data }: { data: UserProps[] }) {
  return <DataTable table_key={STAFF_MANAGEMENT_TABLE} columns={columns} data={data} />;
}
