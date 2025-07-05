import { CircleCheck, CircleX, Loader } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'Cancelled' | 'Completed' | 'Pending' | 'Waiting' | 'Paid' | 'Active' | 'Inactive';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge variant="outline" className="text-foreground px-2 py-1 text-sm rounded-2xl">
      {status === 'Cancelled' && (
        <>
          <CircleX className="fill-status-cancel mr-1" /> Cancelled
        </>
      )}
      {status === 'Completed' && (
        <>
          <CircleCheck className="fill-status-completed mr-1" /> Completed
        </>
      )}
      {status === 'Pending' && (
        <>
          <Loader className="fill-status-pending mr-1" /> Pending
        </>
      )}
      {status === 'Waiting' && (
        <>
          <Loader className="fill-status-waiting mr-1" /> Waiting
        </>
      )}
      {status === 'Paid' && (
        <>
          <CircleCheck className="fill-status-paid mr-1" /> Paid
        </>
      )}
      {status === 'Active' && (
        <>
          <CircleCheck className="fill-status-active mr-1" /> Active
        </>
      )}
      {status === 'Inactive' && (
        <>
          <CircleX className="fill-status-inactive mr-1" /> UnAvailable
        </>
      )}
    </Badge>
  );
};

export default StatusBadge;
