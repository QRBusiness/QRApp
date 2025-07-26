import type { ColumnDef } from '@tanstack/react-table';
import StatusBadge from '../../order-management/status/status-baged';

export type DashboardColumn = {
  _id: string;
  branch: string;
  area: string;
  service_unit: string;
  guess_name: string;
  payment_method: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<DashboardColumn>[] = [
  {
    accessorKey: '_id',
    header: 'ID',
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span className="text-sm font-medium">{index}</span>;
    },
  },
  {
    accessorKey: 'branch',
    header: 'Branch',
  },
  {
    accessorKey: 'area',
    header: 'Area',
  },
  {
    accessorKey: 'service_unit',
    header: 'Service Unit',
  },
  {
    accessorKey: 'guess_name',
    header: 'Guess Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue() as 'Paid' | 'Unpaid';
      return <StatusBadge status={value} />;
    },
  },
  {
    accessorKey: 'payment_method',
    header: 'Payment Method',
    cell: ({ getValue }) => {
      const value = getValue() as 'Cash' | 'Bank';
      return <span className="text-sm">{value}</span>;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <span className="text-sm font-medium">
          {value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleDateString();
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => {
      return new Date(row.getValue('updated_at')).toLocaleDateString();
    },
  },

  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
  },
];
