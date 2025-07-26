import { useEffect } from 'react';
import { mergeOrders } from '@/services/owner/order-service';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomConfirmDialog from '@/components/common/dialog/custom-confirm-dialog';
import { setConfirmDialog, useConfirmDialog } from '@/components/common/states/dialogState';
import { resetOrderSelectedState, useOrderSelectedState } from '@/components/common/states/orderSeletedState';
import CardOrders from './card/card-orders';
import RequestBar from './request';

const OrderManager = () => {
  const { t } = useTranslation();
  const { open } = useConfirmDialog();
  const { selectedOrders } = useOrderSelectedState();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset confirm dialog state when component mounts
    return () => {
      resetOrderSelectedState();
    };
  }, []);

  return (
    <div className="w-full px-2 md:px-0 mx-auto flex flex-col gap-4">
      <CustomConfirmDialog
        open={open}
        onOpenChange={setConfirmDialog}
        title="Confirm Merge and Checkout"
        description="Are you sure you want to merge the selected orders and proceed to checkout?"
        onConfirm={async () => {
          // Handle confirmation logic here
          const token = await mergeOrders(selectedOrders.map((order) => order._id));
          navigate(`${selectedOrders[0]._id}?token=${token}`);
          setConfirmDialog(false);
        }}
        onCancel={() => setConfirmDialog(false)}
      />
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-xl font-semibold">{t('module.order.unassignedRequestSession')}</h1>
        <RequestBar />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('module.order.orderSession')}</h2>
        <CardOrders />
      </div>
    </div>
  );
};

export default OrderManager;
