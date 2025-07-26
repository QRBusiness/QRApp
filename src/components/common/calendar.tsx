import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CalendarComponentProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

export function CalendarComponent({ openDialog, setOpenDialog, date, setDate, placeholder }: CalendarComponentProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Popover open={openDialog} onOpenChange={setOpenDialog}>
        <PopoverTrigger asChild>
          <Button variant="outline" id="date" className="w-full justify-between font-normal">
            {date ? date.toLocaleDateString() : placeholder || 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpenDialog(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
