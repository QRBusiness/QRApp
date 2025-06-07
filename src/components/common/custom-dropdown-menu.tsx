import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface CustomDropdownMenuProps {
  open?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  alignOffset?: number;
  label?: string;
  items?: {
    label: string;
    icon?: React.ReactNode;
    shortcut?: React.ReactNode;
    isdisabled?: boolean | false;
    onClick: () => void;
  }[];
}

export function CustomDropdownMenu(props: CustomDropdownMenuProps) {
  const {
    open,
    modal,
    onOpenChange,
    children,
    align,
    side,
    sideOffset,
    alignOffset,
    label,
    items,
  } = props;
  return (
    <DropdownMenu open={open} modal={modal} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" asChild>
          {children}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="min-w-58 px-3 py-2"
      >
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-2">
          {items?.map((item, index) => (
            <DropdownMenuItem key={index} onClick={item.onClick} disabled={item.isdisabled}>
              <span className="flex items-center space-x-2">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </span>
              {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
