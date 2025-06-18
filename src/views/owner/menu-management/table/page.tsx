import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type Menu, columns } from './columns';

export default function MenuTable({ data }: { data: Menu[] }) {
  return <DataTable columns={columns} data={data} />;
}
