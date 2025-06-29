import { MENU_MANAGEMENT_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type Menu, columns } from './columns';

export default function MenuTable({ data }: { data: Menu[] }) {
  return <DataTable table_key={MENU_MANAGEMENT_TABLE} columns={columns} data={data} />;
}
