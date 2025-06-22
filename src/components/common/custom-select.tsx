import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl } from '../ui/form';

interface CustomSelectProps {
  options: { value: string; label: string }[];
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onFieldChange?: (value: string) => void;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  defaultValue,
  placeholder,
  onFieldChange,
  disabled = false,
}) => {
  return (
    <Select onValueChange={onFieldChange} defaultValue={defaultValue} value={value}>
      <FormControl>
        <SelectTrigger className="flex-1 w-full min-w-[156px]" disabled={disabled}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
