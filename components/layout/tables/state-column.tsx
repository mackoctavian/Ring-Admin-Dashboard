import { Badge } from "@/components/ui/badge"

interface StateColumnProps {
    state: boolean;
  }

export const StateColumn = ({ state }: StateColumnProps): JSX.Element => {
 return (
        <>
            <Badge variant={state ? "default" : "destructive"}>
                {state ? "Active" : "Inactive"}
            </Badge>
        </>
    );
};
  