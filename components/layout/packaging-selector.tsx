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

export default function PackagingSelector({ value, onChange }: Props) {
    return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select packaging" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Item">Per Item</SelectItem>
              <SelectItem value="Carton">Per Carton</SelectItem>
              <SelectItem value="Crate">Per Crate</SelectItem>
              <SelectItem value="Bottle">Per Bottle</SelectItem>
              <SelectItem value="Box">Per Box</SelectItem>
              <SelectItem value="Pallet">Per Pallet</SelectItem>
              <SelectItem value="Bag">Per Bag</SelectItem>
              <SelectItem value="Can">Per Can</SelectItem>
              <SelectItem value="Drum">Per Drum</SelectItem>
              <SelectItem value="Sack">Per Sack</SelectItem>
              <SelectItem value="Tube">Per Tube</SelectItem>
              <SelectItem value="Tray">Per Tray</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      
}