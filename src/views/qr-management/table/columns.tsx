import type { ColumnDef } from '@tanstack/react-table';
import { Download, Edit, Eye, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    cell: ({ row }) => {
      const tableName = row.getValue('table') as string;
      return <span className="text-sm text-gray-800">{tableName}</span>;
    },
  },
  {
    accessorKey: 'area',
    header: 'module.qrManagement.table.area',
    cell: ({ row }) => {
      const area = row.getValue('area');
      return (
        <span className="text-sm text-gray-600">
          {typeof area === 'string' && area.trim() !== '' ? area : 'No area assigned'}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'module.qrManagement.table.status',
    cell: ({ row }) => {
      const status = row.getValue('status') as QRTable['status'];
      return (
        <Badge variant={'outline'} className={`font-medium`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'available',
    header: 'module.qrManagement.table.available',
    cell: ({ row }) => {
      const isAvailable = row.getValue('available');
      return (
        <Badge className="font-medium" variant={isAvailable ? 'default' : 'destructive'}>
          {isAvailable ? 'Yes' : 'No'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'module.qrManagement.table.createdAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
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
