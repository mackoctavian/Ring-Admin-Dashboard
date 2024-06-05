import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
  } from "@/components/ui/select";
  
  interface Props {
    value?: string;
    onChange: (value: string) => void;
  }
  
  export default function BusinessSizeSelector({ value, onChange }: Props) {
      return (
          <Select value={value?.trim()} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select business size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Micro">Micro: 1 to 9 employees</SelectItem>
                <SelectItem value="Small">Small: 10 to 49 employees</SelectItem>
                <SelectItem value="Medium">Medium: 50 to 249 employees</SelectItem>
                <SelectItem value="Large">Large: 250 or more employees</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
        
  }