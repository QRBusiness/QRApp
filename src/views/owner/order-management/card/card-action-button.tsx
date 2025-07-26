import React from 'react';
import { Combine } from 'lucide-react';
import { setConfirmDialog } from '@/components/common/states/dialogState';
import { useOrderSelectedState } from '@/components/common/states/orderSeletedState';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CardActionButtonProps {
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
}

const CardActionButton = ({ children, side, align, sideOffset, alignOffset }: CardActionButtonProps) => {
  const { selectedOrders } = useOrderSelectedState();

  const handleMergeAndCheckout = () => {
    // Logic to merge selected orders and proceed to checkout
    if (selectedOrders.length === 0 || selectedOrders.length === 1) {
      return;
    }
    setConfirmDialog(true);
  };
  return (
    <DropdownMenu key={'confirm-dialog'}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
        <DropdownMenuLabel>Card Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleMergeAndCheckout}
          disabled={selectedOrders.length === 0 || selectedOrders.length === 1}
        >
          <Combine className="size-4 md:size-5" />
          Merge & Checkout Selected Orders
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default CardActionButton;
