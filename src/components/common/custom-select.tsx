import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl } from '../ui/form';

interface CustomSelectProps {
  options: { value: string; label: string }[];
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onFieldChange?: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  defaultValue,
  placeholder,
  onFieldChange,
}) => {
  return (
    <Select onValueChange={onFieldChange} defaultValue={defaultValue} value={value}>
      <FormControl>
        <SelectTrigger className="flex-1 min-w-[156px] max-w-[400px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
