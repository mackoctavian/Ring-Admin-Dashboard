import { formatNumber } from "@/lib/utils"

interface NumberColumnProps {
    value: number;
  }

export const NumberColumn = ({ value }: NumberColumnProps): JSX.Element => {
 return (
        <>
            { formatNumber(value) }
        </>
    );
};