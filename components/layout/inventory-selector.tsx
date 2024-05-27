
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listVariants } from "@/lib/actions/inventory.actions"
import { InventoryVariant } from "@/types";

interface Props {
  value?: InventoryVariant;
  onChange: (value: InventoryVariant) => void;
}

const InventorySelector: React.FC<Props> = ({ value, onChange }) => {
  const [inventory, setInventory] = useState<InventoryVariant[]>([]);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const inventoryData = await listVariants();
        setInventory(inventoryData);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    }
    fetchInventory();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedInventory = inventory.find(inv => inv.$id === value);
    if (selectedInventory) {
      onChange(selectedInventory);
    }
  };

  return (
    <Select value={value ? value.$id : 'Select inventory item'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.inventory?.title + " " + value.name : 'Select inventory item'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {inventory.map((inventoryItem) => (
          <SelectItem key={inventoryItem.$id} value={inventoryItem.$id}>
            { inventoryItem.inventory?.title + " " + inventoryItem.name }
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default InventorySelector;