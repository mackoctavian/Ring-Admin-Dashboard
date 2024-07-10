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

export default function ExpenseCategorySelector({ value, onChange }: Props) {
    return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Advertising and Marketing">Advertising and Marketing</SelectItem>
              <SelectItem value="Bank Fees and Interest">Bank Fees and Interest</SelectItem>
              <SelectItem value="Business Insurance">Business Insurance</SelectItem>
              <SelectItem value="Business Licenses and Permits">Business Licenses and Permits</SelectItem>
              <SelectItem value="Business Meals and Entertainment">Business Meals and Entertainment</SelectItem>
              <SelectItem value="Business Travel">Business Travel</SelectItem>
              <SelectItem value="Communication (Phone/Internet)">Communication (Phone/Internet)</SelectItem>
              <SelectItem value="Contract Labor">Contract Labor</SelectItem>
              <SelectItem value="Depreciation">Depreciation</SelectItem>
              <SelectItem value="Dues and Subscriptions">Dues and Subscriptions</SelectItem>
              <SelectItem value="Education and Training">Education and Training</SelectItem>
              <SelectItem value="Equipment and Supplies">Equipment and Supplies</SelectItem>
              <SelectItem value="Legal and Professional Fees">Legal and Professional Fees</SelectItem>
              <SelectItem value="Office Rent or Mortgage">Office Rent or Mortgage</SelectItem>
              <SelectItem value="Payroll and Benefits">Payroll and Benefits</SelectItem>
              <SelectItem value="Postage and Shipping">Postage and Shipping</SelectItem>
              <SelectItem value="Repairs and Maintenance">Repairs and Maintenance</SelectItem>
              <SelectItem value="Software and Technology">Software and Technology</SelectItem>
              <SelectItem value="Taxes">Taxes</SelectItem>
              <SelectItem value="Utilities">Utilities</SelectItem>
              <SelectItem value="Vehicle Expenses">Vehicle Expenses</SelectItem>
              <SelectItem value="Other">Other</SelectItem> 
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      
}