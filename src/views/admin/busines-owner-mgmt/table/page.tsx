import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type BusinessOwner, columns } from './columns';

export default function BusinessOwnerTable({ data }: { data: BusinessOwner[] }) {
  return <DataTable columns={columns} data={data} />;
}
