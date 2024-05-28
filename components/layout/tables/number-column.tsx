import { formatNumber } from "@/lib/utils"

interface NumberColumnProps {
    prefix?: string;
    value: number;
    suffix?: string;
  }

export const NumberColumn = ({ prefix, value, suffix }: NumberColumnProps): JSX.Element => {
    return (
        <>
            {prefix && <span>{prefix} </span>}
            {formatNumber(value)}
            {suffix && <span> {suffix}</span>}
        </>
    );
};
