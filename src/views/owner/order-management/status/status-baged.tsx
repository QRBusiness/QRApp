import { CircleCheck, CircleX, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'Cancelled' | 'Completed' | 'Pending' | 'Waiting' | 'Paid' | 'Active' | 'Inactive' | 'Unpaid';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();
  return (
    <Badge
      variant="outline"
      className="text-foreground px-2 py-1 text-sm rounded-2xl bg-background drop-shadow-xl shadow-xl"
    >
      {status === 'Cancelled' && (
        <>
          <CircleX className="fill-status-cancel mr-1" /> {t('module.status.cancelled') || 'Cancelled'}
        </>
      )}
      {status === 'Completed' && (
        <>
          <CircleCheck className="fill-status-completed mr-1" /> {t('module.status.completed') || 'Completed'}
        </>
      )}
      {status === 'Pending' && (
        <>
          <Loader className="fill-status-pending mr-1" /> {t('module.status.pending') || 'Pending'}
        </>
      )}
      {status === 'Waiting' && (
        <>
          <Loader className="fill-status-waiting mr-1" /> {t('module.status.waiting') || 'Waiting'}
        </>
      )}
      {status === 'Unpaid' && (
        <>
          <CircleX className="fill-status-inactive   mr-1" /> {t('module.status.unpaid') || 'Unpaid'}
        </>
      )}
      {status === 'Paid' && (
        <>
          <CircleCheck className="fill-status-paid mr-1" /> {t('module.status.paid') || 'Paid'}
        </>
      )}
      {status === 'Active' && (
        <>
          <CircleCheck className="fill-status-active mr-1" /> {t('module.status.active') || 'Active'}
        </>
      )}
      {status === 'Inactive' && (
        <>
          <CircleX className="fill-status-inactive mr-1" /> {t('module.status.inactive') || 'UnAvailable'}
        </>
      )}
    </Badge>
  );
};

export default StatusBadge;
