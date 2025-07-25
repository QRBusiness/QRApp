import React from 'react';
import { Combine } from 'lucide-react';
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
        <DropdownMenuLabel>Card Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log({ selectedOrders })}>
          <Combine className="size-4 md:size-5" />
          Merge Selected Orders
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default CardActionButton;
