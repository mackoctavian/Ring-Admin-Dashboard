import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

type SubmitButtonProps = {
    label: string;
    loading: boolean;
};
  
export const SubmitButton = ({ label, loading }: SubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; {loading}
                </>
                ) : (
                label
            )}
        </Button> 
    );
};