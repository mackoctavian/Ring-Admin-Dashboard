import { formatAmount } from "@/lib/utils"

interface MoneyColumnProps {
    value?: number | null;
    currency: string;
  }

export const MoneyColumn = ({ value, currency }: MoneyColumnProps): JSX.Element => {
    if (!value) {
        return <>0</>;
    }

    return (
        <>
            { formatAmount(value, currency) }
        </>
    );
};
  