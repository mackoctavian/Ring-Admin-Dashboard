import { formatAmount } from "@/lib/utils"

interface MoneyColumnProps {
    value?: number | null;
  }

export const MoneyColumn = ({ value }: MoneyColumnProps): JSX.Element => {
    if (!value) {
        return <></>;
    }

    return (
        <>
            { formatAmount(value) }
        </>
    );
};
  