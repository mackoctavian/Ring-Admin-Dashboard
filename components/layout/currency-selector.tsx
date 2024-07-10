import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export default function CurrencySelector({ value, onChange }: Props) {
    return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="TZS">Tanzanian Shillings</SelectItem>
              <SelectItem value="USD">US Dollars</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      
}