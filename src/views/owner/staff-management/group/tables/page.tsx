import { BUSINESS_OWNER_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type GroupProps, columns } from './columns';

export default function GroupTable({ data }: { data: GroupProps[] }) {
  return <DataTable table_key={BUSINESS_OWNER_TABLE} columns={columns} data={data} />;
}
