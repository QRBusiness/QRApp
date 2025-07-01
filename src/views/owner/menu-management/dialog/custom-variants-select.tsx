import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CustomVariantsSelectProps {
  value?: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
  selectLabel?: string;
}

export function CustomVariantsSelect({
  value,
  onChange,
  options,
  placeholder,
  selectLabel,
}: CustomVariantsSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} defaultValue={value}>
      <SelectTrigger className="flex-1 w-full min-w-[156px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectLabel && <SelectLabel>{selectLabel}</SelectLabel>}
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
