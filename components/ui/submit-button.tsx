import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import Image from 'next/image'
import { cn } from '@/lib/utils';

type SubmitButtonProps = {
    label: string;
    loading: boolean;
};
  
export const SubmitButton = ({ label, loading }: SubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (        
        <Button type="submit" disabled={loading}>
            {loading ? (
                <>
                    <div className="relative size-5">
                        <Image
                            src="/icons/icons/loading.svg"
                            fill
                            className={cn( "mr-2 h-6 w-6 animate-spin", // Always applied
                                "brightness-[10] invert-0", // Applied in light mode
                                "dark:brightness-100" // Applied in dark mode
                            )}
                            alt=""
                            />
                    </div>
                    &nbsp; processing...
                </>
                ) : (
                label
            )}
        </Button> 
    );
};