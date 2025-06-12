import React from 'react';
import { format } from 'date-fns';
import { Download, Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PopUpQRCode from '../details/pop-up-qr-code';

export interface MobileCardItemProps {
  id: string;
  table: string;
  area: string;
  status: 'Ordering' | 'Staff Call' | 'Paid' | 'Cancelled';
  available: boolean;
  createdAt: string;
}

const MobileCardItem: React.FC<MobileCardItemProps> = ({
  id,
  table,
  area,
  status,
  available,
  createdAt,
}) => {
  const formattedDate = format(new Date(createdAt), 'MMM dd, yyyy • h:mm a');
  const { t } = useTranslation();
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
              {status}
            </Badge>
            <Badge variant={available ? 'default' : 'destructive'}>
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
        </div>
      </CardContent>

      <Separator className="my-1" />

      <CardFooter className="py-3 flex flex-row justify-between space-x-1 self-center">
        <PopUpQRCode
          title={t('module.qrManagement.preview.title')}
          description={t('module.qrManagement.preview.description')}
          url="https://example.com/qr-code"
        >
          <Button variant="outline" size="sm">
            <Eye className="text-xs" />
            <span>{t('module.qrManagement.table.actionButton.view')}</span>
          </Button>
        </PopUpQRCode>

        <Button variant="outline" size="sm">
          <Download className="text-xs" />
          <span>{t('module.qrManagement.table.actionButton.downloadShortKey')}</span>
        </Button>

        <Button variant="outline" size="sm">
          <Edit className="text-xs" />
          <span>{t('module.qrManagement.table.actionButton.edit')}</span>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="text-xs" />
              <span>{t('module.qrManagement.table.actionButton.delete')}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the table record and
                remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="!rounded-button">Cancel</AlertDialogCancel>
              <AlertDialogAction className="!rounded-button bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                <Trash className="text-xs mr-2" />
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default MobileCardItem;
