import { InventoryVariant } from "@/types";

interface InventoryItemNameColumnProps {
    data: InventoryVariant;
  }

export const InventoryItemNameColumn = ({ data }: InventoryItemNameColumnProps): JSX.Element => {
 return (
        <>
            { data.fullName }
        </>
    );
};
  