import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/libs/utils';

interface TabProps {
  label: string;
  value: string;
}

interface HorizontalFilterScrollProps {
  orderStatuses?: TabProps[];
  className?: string;
  onChange?: (value: string) => void;
}

const HorizontalFilterScroll = ({ orderStatuses, onChange, ...props }: HorizontalFilterScrollProps) => {
  return (
    <ScrollArea className={cn('w-full whitespace-nowrap', props.className)}>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex space-x-1 p-1">
          {orderStatuses?.map((status) => (
            <TabsTrigger
              key={status.value}
              value={status.value}
              className="px-4 py-1.5 text-sm font-medium cursor-pointer"
              onClick={() => onChange && onChange(status.value)}
            >
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
export default HorizontalFilterScroll;
