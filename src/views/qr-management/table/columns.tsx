import type { ColumnDef } from '@tanstack/react-table';
import { Download, Edit, Eye, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type QRTable = {
  id: string;
  table: string;
  area: string;
  status: 'ordering' | 'staff call' | 'paid' | 'cancelled';
  available: boolean;
  createdAt: string;
};

export const columns: ColumnDef<QRTable>[] = [
  {
    accessorKey: 'id',
    header: 'module.qrManagement.table.id',
  },
  {
    accessorKey: 'table',
    header: 'module.qrManagement.table.table',
  },
  {
    accessorKey: 'area',
    header: 'module.qrManagement.table.area',
  },
  {
    accessorKey: 'status',
    header: 'module.qrManagement.table.status',
  },
  {
    accessorKey: 'available',
    header: 'module.qrManagement.table.available',
  },
  {
    accessorKey: 'createdAt',
    header: 'module.qrManagement.table.createdAt',
  },
  {
    id: 'actions',
    header: 'module.qrManagement.table.actions',
    cell: () => (
      <div className="flex items-center gap-2">
        {/* Add action buttons here, e.g., Edit, Delete */}
        <Button variant={'outline'} className="hover:bg-primary hover:text-primary-foreground">
          <Eye className="mr-2" />
          View
        </Button>
        <Button variant={'outline'} className="hover:bg-primary hover:text-primary-foreground">
          <Download className="mr-2" />
          Download
        </Button>
        <Button variant={'outline'} className="hover:bg-primary hover:text-primary-foreground">
          <Edit className="mr-2" />
          Edit
        </Button>
        <Button
          variant={'outline'}
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash className="mr-2" />
          Delete
        </Button>
      </div>
    ),
  },
];
