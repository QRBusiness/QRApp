import React from 'react';
import { MENU_MANAGEMENT, UNAUTHORIZED } from '@/constants';
import { useDeleteTable } from '@/services/owner/table-service';
import { format } from 'date-fns';
import { CircleCheck, CircleX, Download, Edit, Eye, Trash } from 'lucide-react';
import QRCode from 'qrcode';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { useUserState } from '@/components/common/states/userState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PopUpQRCode from '../details/pop-up-qr-code';
import EditTableDialog from '../edit/edit-table-dialog';

export interface MobileCardItemProps {
  id: string;
  table: string;
  table_id: string;
  area: string;
  area_id: string;
  branch: string;
  available: boolean;
  created_at: string;
  updated_at?: string;
}

const MobileCardItem: React.FC<MobileCardItemProps> = ({
  id,
  table,
  area,
  available,
  created_at,
  area_id,
  table_id,
  branch,
}) => {
  const formattedDate = format(new Date(created_at), 'MMM dd, yyyy • h:mm a');
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  const location = window.location.origin;
  const user = useUserState();
  const { deleteTable } = useDeleteTable();

  const navigateURL = `${location}/${UNAUTHORIZED}/${user.business._id}/${MENU_MANAGEMENT}?area=${area_id}&table=${table_id}`;

  QRCode.toDataURL(navigateURL, { errorCorrectionLevel: 'H' })
    .then((url) => {
      setQrCodeUrl(url);
    })
    .catch((error) => {
      console.log({ error });
      toast.error(t('module.qrManagement.qrGenerationError'), {
        description: t('module.qrManagement.qrGenerationErrorDescription'),
      });
    });

  const handleDownload = (url: string) => {
    if (!url) {
      toast.error(t('module.qrManagement.qrDownloadError'), {
        description: t('module.qrManagement.qrDownloadErrorDescription'),
      });
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-code-${area}-${table}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t('module.qrManagement.qrDownloadSuccess'), {
      description: t('module.qrManagement.qrDownloadSuccessDescription'),
    });
  };

  return (
    <Card className="mb-4 shadow-sm borde">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">ID: {id}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="font-medium" variant={'outline'}>
              Pending
            </Badge>
            <Badge variant="outline" className="text-foreground px-[3px] text-sm rounded-2xl">
              {available === true ? (
                <CircleCheck className="fill-status-active mr-1" />
              ) : (
                <CircleX className="fill-status-inactive mr-1" />
              )}
              {available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-3">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground w-20 flex-shrink-0 text-sm">Table:</span>
            <span className="font-medium text-black">{table}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground w-20 flex-shrink-0 text-sm">Area:</span>
            <span className="text-black">{area}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground w-20 flex-shrink-0 text-sm">Branch:</span>
            <span className="text-black">{branch}</span>
          </div>
        </div>
      </CardContent>

      <Separator className="my-1" />

      <CardFooter className="py-3 flex flex-row justify-between space-x-1 self-center flex-1 max-full min-w-3/4">
        {/* View */}
        <PopUpQRCode
          title={t('module.qrManagement.preview.title')}
          description={t('module.qrManagement.preview.description')}
          url={qrCodeUrl}
          onDownload={() => handleDownload(qrCodeUrl)}
        >
          <Button variant="outline" size="sm">
            <Eye className="text-xs" />
            <span>{t('module.qrManagement.table.actionButton.view')}</span>
          </Button>
        </PopUpQRCode>
        {/* Download */}
        <Button variant="outline" size="sm" onClick={() => handleDownload(qrCodeUrl)} disabled={!qrCodeUrl}>
          <Download className="text-xs" />
          <span>{t('module.qrManagement.table.actionButton.downloadShortKey')}</span>
        </Button>
        {/* Edit */}
        <EditTableDialog
          initialValues={{
            name: table,
            qr_code: '',
          }}
          id={table_id}
          open={open}
          onOpenChange={setOpen}
          title={t('module.qrManagement.edit.title')}
          description={t('module.qrManagement.edit.description')}
          onSubmit={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          <Button variant="outline" size="sm">
            <Edit className="text-xs" />
            <span>{t('module.qrManagement.table.actionButton.edit')}</span>
          </Button>
        </EditTableDialog>
        {/* Delete */}
        <CustomAlertDialog
          title={t('module.qrManagement.alertDialog.title')}
          description={t('module.qrManagement.alertDialog.description')}
          onSubmit={async () => await deleteTable(table_id)}
        >
          <Button variant={'outline'} size={'sm'} className="hover:bg-destructive hover:text-destructive-foreground">
            <Trash className="text-xs" />
            {t('module.qrManagement.table.actionButton.delete')}
          </Button>
        </CustomAlertDialog>
      </CardFooter>
    </Card>
  );
};

export default MobileCardItem;
