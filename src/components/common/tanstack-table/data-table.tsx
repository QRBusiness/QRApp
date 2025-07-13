import React, { useEffect } from 'react';
import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Columns3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Hint } from '@/components/common/hint';
import { DataTablePagination } from '@/components/common/tanstack-table/pagination';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, loadFromLocalStorage, saveToLocalStorage } from '@/libs/utils';

// Extend the ColumnMeta type to include className
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown = unknown, TValue = unknown> {
    className?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  table_key: string; // Add key prop to DataTableProps
  filterComponent?: React.ReactNode; // Optional filter component
}

export function DataTable<TData, TValue>({
  columns,
  data,
  table_key,
  filterComponent: FilterComponent,
}: DataTableProps<TData, TValue>) {
  // Initialize column visibility states
  const visibilityMemo = loadFromLocalStorage(table_key + '_visibility', {
    created_at: false,
    updated_at: false,
  }) as VisibilityState;
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(visibilityMemo);

  // Save column visibility to local storage whenever it changes
  useEffect(() => {
    saveToLocalStorage(table_key + '_visibility', columnVisibility);
  }, [columnVisibility, table_key]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row items-center justify-between w-full">
        {FilterComponent && <div className="flex items-center space-x-2">{FilterComponent}</div>}
        {/* Render the filter component if provided */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto space-x-2">
              <Columns3 /> {t('module.common.table.visibleColumns')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              typeof header.column.columnDef.header === 'string'
                                ? t(header.column.columnDef.header)
                                : header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => {
                      // Check if this cell is in the "description" column
                      const isDescriptionColumn = cell.column.id === 'description' || cell.column.id === 'address';
                      const isActionsColumn = cell.column.id === 'actions';

                      // If it is, truncate the content
                      if (isDescriptionColumn) {
                        return (
                          <Hint label={cell.getValue() as string} key={cell.id} align="start">
                            <TableCell
                              className={cn('max-w-[200px] truncate', cell.column.columnDef.meta?.className || '')}
                              key={cell.id}
                              title={cell.getValue() as string} // Show full text on hover
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          </Hint>
                        );
                      }
                      if (isActionsColumn) {
                        return (
                          <TableCell
                            className={cn('min-w-[300px] truncate', cell.column.columnDef.meta?.className || '')}
                            key={cell.id}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          className={cn('max-w-[300px] truncate', cell.column.columnDef.meta?.className || '')}
                          key={cell.id}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
