import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Hint } from '@/components/common/hint';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">
          {t('module.qrManagement.table.pagination.rowPerPage')}
        </p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t('module.qrManagement.table.pagination.pagePerTotalpages', {
            currentPage: table.getState().pagination.pageIndex + 1,
            totalPages: table.getPageCount(),
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Hint label={t('module.qrManagement.table.pagination.goToFirstPage')} sideOffset={10}>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">
                {t('module.qrManagement.table.pagination.goToFirstPage')}
              </span>
              <ChevronsLeft />
            </Button>
          </Hint>
          <Hint label={t('module.qrManagement.table.pagination.goToPreviousPage')} sideOffset={10}>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">
                {t('module.qrManagement.table.pagination.goToPreviousPage')}
              </span>
              <ChevronLeft />
            </Button>
          </Hint>
          <Hint label={t('module.qrManagement.table.pagination.goToNextPage')} sideOffset={10}>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex cursor-pointer"
              onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">
                {t('module.qrManagement.table.pagination.goToNextPage')}
              </span>
              <ChevronsRight />
            </Button>
          </Hint>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">
              {t('module.qrManagement.table.pagination.goToNextPage')}
            </span>
            <ChevronRight />
          </Button>
          <Hint label={t('module.qrManagement.table.pagination.goToLastPage')} sideOffset={10}>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex cursor-pointer"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">
                {t('module.qrManagement.table.pagination.goToLastPage')}
              </span>
              <ChevronsRight />
            </Button>
          </Hint>
        </div>
      </div>
    </div>
  );
}
