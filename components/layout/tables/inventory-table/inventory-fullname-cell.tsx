import { InventoryVariant } from "@/types";

interface InventoryItemNameColumnProps {
    data: InventoryVariant;
  }

export const InventoryItemNameColumn = ({ data }: InventoryItemNameColumnProps): JSX.Element => {
 return (
        <>
            { data.inventory?.title + " " + data.name }
        </>
    );
};
  