import { BRANCH_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type AreaProps, columns } from './columns';

export default function AreasTable({ data }: { data: AreaProps[] }) {
  return <DataTable table_key={BRANCH_TABLE} columns={columns} data={data} />;
}
