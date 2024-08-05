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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInventory() {
      try {
        setIsLoading(true);
        const inventoryData = await listVariants();
        setInventory(inventoryData || []); // Ensure it's always an array
        setError(null);
      } catch (error: any) {
        setError("Failed to load inventory");
        console.error("Error fetching inventory:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId === 'default' ? '' : selectedId);
  };

  // Safely find the selected inventory item
  const selectedInventory = inventory.find(inv => inv.$id === value);

  // Group inventory items by a property (e.g., Inventory)
  const groupedInventory = inventory.reduce((groups, item) => {
    if (item && item.inventory && item.inventory.title) {
      if (!groups[item.inventory.title]) {
        groups[item.inventory.title] = [];
      }
      groups[item.inventory.title].push(item);
    }
    return groups;
  }, {} as { [key: string]: InventoryVariant[] });

  // Function to format category names
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  if (isLoading) {
    return <div className={`text-sm text-muted-foreground`}>Loading stock items...</div>;
  }

  if (error) {
    return <div className={`text-sm text-destructive-foreground`}>Error: could not load stock items</div>;
  }

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {value ? selectedInventory?.fullName || 'Select stock item' : 'Select stock item'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" disabled>
            Select stock item
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