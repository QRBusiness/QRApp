import { QR_MANAGEMENT_TABLE } from '@/constants';
import { DataTable } from '@/components/common/tanstack-table/data-table';
import { type QRTable, columns } from './columns';

export default function QRTable({ data }: { data: QRTable[] }) {
  return (
    <div className="container mx-auto py-4">
      <DataTable table_key={QR_MANAGEMENT_TABLE} columns={columns} data={data} />
    </div>
  );
}
