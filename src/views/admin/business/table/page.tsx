import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type BusinessType, columns } from './columns';

export default function BusinessTable({ data }: { data: BusinessType[] }) {
  return <DataTable columns={columns} data={data} />;
}
