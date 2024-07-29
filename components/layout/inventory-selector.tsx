import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listVariants } from "@/lib/actions/inventory.actions"
import { InventoryVariant } from "@/types";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

const InventorySelector: React.FC<Props> = ({ value, onChange }) => {
  const [inventory, setInventory] = useState<InventoryVariant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const inventoryData = await listVariants();
        setInventory(inventoryData);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId);
  };

  const selectedInventory = inventory.find(inv => inv.$id === value);

  // Group inventory items by a property (e.g., Inventory)
  const groupedInventory = inventory.reduce((groups, item) => {
    if (!groups[item.inventory.title]) {
      groups[item.inventory.title] = [];
    }
    groups[item.inventory.title].push(item);
    return groups;
  }, {} as { [key: string]: InventoryVariant[] });

  // Function to format category names
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue>
            {loading ? 'Loading...' : (selectedInventory ? selectedInventory.fullName : 'Select inventory item')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" disabled>
            Select inventory item
          </SelectItem>
          {Object.keys(groupedInventory).map(category => (
              <SelectGroup key={category}>
                <SelectLabel>{formatCategory(category)}</SelectLabel>
                {groupedInventory[category].map((item) => (
                    <SelectItem key={item.$id} value={item.$id}>
                      {item.fullName}
                    </SelectItem>
                ))}
              </SelectGroup>
          ))}
        </SelectContent>
      </Select>
  );
};

export default InventorySelector;