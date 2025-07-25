import { GROUP_MANAGEMENT_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type GroupProps, columns } from './columns';

export default function GroupTable({ data }: { data: GroupProps[] }) {
  return <DataTable table_key={GROUP_MANAGEMENT_TABLE} columns={columns} data={data} />;
}
