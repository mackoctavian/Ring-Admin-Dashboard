import { formatAmount } from "@/lib/utils"

interface MoneyColumnProps {
    value: number;
  }

export const MoneyColumn = ({ value }: MoneyColumnProps): JSX.Element => {
 return (
        <>
            { formatAmount(value) }
        </>
    );
};
  