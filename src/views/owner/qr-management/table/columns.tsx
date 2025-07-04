import React from 'react';
import { useDeleteTable } from '@/services/owner/table-service';
import type { ColumnDef } from '@tanstack/react-table';
import { CircleCheck, CircleX, Download, Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';
import PopUpQRCode from '../details/pop-up-qr-code';
import EditTableDialog from '../edit/edit-table-dialog';

export type QRTable = {
  _id: string;
  name: string;
  qr_code: string;
  area: string;
  branch: string;
  available: boolean;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<QRTable>[] = [
  {
    accessorKey: '_id',
    header: 'ID',
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.index + 1}</span>;
    },
  },
  {
    accessorKey: 'name',
    header: 'module.qrManagement.table.table',
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue('name')}</span>;
    },
  },
  {
    accessorKey: 'area',
    header: 'module.qrManagement.table.area',
  },
  {
    accessorKey: 'available',
    header: 'Available',
    cell: ({ row }) => (
      <Badge variant="outline" className="text-foreground px-2 py-1 text-sm rounded-2xl">
        {row.original.available === true ? (
          <CircleCheck className="fill-status-active mr-1" />
        ) : (
          <CircleX className="fill-status-inactive mr-1" />
        )}
        {row.original.available ? 'Available' : 'Unavailable'}
      </Badge>
    ),
  },
  {
    accessorKey: 'branch',
    header: 'Branch',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      return formattedDate(row.getValue('created_at'));
    },
    enableHiding: true,
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => {
      return formattedDate(row.getValue('updated_at'));
    },
    enableHiding: true,
  },
  {
    id: 'actions',
    header: 'module.qrManagement.table.actions',
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const { t } = useTranslation();

      const { deleteTable } = useDeleteTable();

      const handleDownload = (url: string) => {
        if (!url) {
          toast.error(t('module.qrManagement.qrDownloadError'), {
            description: t('module.qrManagement.qrDownloadErrorDescription'),
          });
          return;
        }
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${row.getValue('area')}-${row.getValue('name')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t('module.qrManagement.qrDownloadSuccess'), {
          description: t('module.qrManagement.qrDownloadSuccessDescription'),
        });
      };

      return (
        <div className="flex items-center gap-2">
          {/* Add action buttons here, e.g., Edit, Delete */}
          <PopUpQRCode
            title={t('module.qrManagement.preview.title')}
            description={t('module.qrManagement.preview.description')}
            url={row.original.qr_code || ''}
            onDownload={() => handleDownload(row.original.qr_code || '')}
          >
            <Button variant={'outline'} className="hover:bg-primary hover:text-primary-foreground">
              <Eye className="mr-2" />
              {t('module.qrManagement.table.actionButton.view')}
            </Button>
          </PopUpQRCode>
          <Button
            variant={'outline'}
            className="hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleDownload(row.original.qr_code || '')}
          >
            <Download className="mr-2" />
            {t('module.qrManagement.table.actionButton.download')}
          </Button>
          <EditTableDialog
            initialValues={{
              name: row.getValue('name'),
              qr_code: row.getValue('qr_code'),
            }}
            id={row.original._id}
            open={open}
            onOpenChange={setOpen}
            title={t('module.qrManagement.edit.title')}
            description={t('module.qrManagement.edit.description')}
            onSubmit={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          >
            <Button variant={'outline'} className="hover:bg-primary hover:text-primary-foreground">
              <Edit className="mr-2" />
              {t('module.qrManagement.table.actionButton.edit')}
            </Button>
          </EditTableDialog>
          <CustomAlertDialog
            title={t('module.qrManagement.alertDialog.title')}
            description={t('module.qrManagement.alertDialog.description')}
            onSubmit={async () => await deleteTable(row.original._id)}
          >
            <Button variant={'outline'} className="hover:bg-destructive hover:text-destructive-foreground">
              <Trash className="mr-2" />
              {t('module.qrManagement.table.actionButton.delete')}
            </Button>
          </CustomAlertDialog>
        </div>
      );
    },
  },
];
