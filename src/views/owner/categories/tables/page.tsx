import { CATEGORY_MANAGEMENT_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type CategogyProps, columns } from './columns';

export default function CategoryTable({ data }: { data: CategogyProps[] }) {
  return <DataTable table_key={CATEGORY_MANAGEMENT_TABLE} columns={columns} data={data} />;
}
