import { SUBCATEGORY_MANAGEMENT_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type SubcategoryProps, columns } from './columns';

export default function SubcategoryTable({ data }: { data: SubcategoryProps[] }) {
  return <DataTable table_key={SUBCATEGORY_MANAGEMENT_TABLE} columns={columns} data={data} />;
}
