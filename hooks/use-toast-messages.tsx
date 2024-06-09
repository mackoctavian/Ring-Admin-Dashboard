import { useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { FormState } from '@/lib/utils/zod-form-state';

const useToastMessage = (formState: FormState) => {
  const { toast } = useToast();
  const prevTimestamp = useRef(formState.timestamp);

  const showToast = formState.message && formState.timestamp !== prevTimestamp.current;

  console.log('showToast', showToast);
  console.log('formState For toast', formState.status);
  console.log('formState MEssage toast', formState.message);

formState.status
  useEffect(() => {
    if (showToast) {
      if (formState.status === 'ERROR') {
        toast({
            variant: 'warning',
            title: 'Data validation failed!',
            description: formState.message,
          });
      } else {
        toast({
            variant: 'success',
            title: 'Success!',
            description: formState.message,
          });
      }

      prevTimestamp.current = formState.timestamp;
    }
  }, [formState, showToast]);

  // stay usable without JS
  return (
    <noscript>
      {formState.status === 'ERROR' && (
        <div style={{ color: 'red' }}>{formState.message}</div>
      )}

      {formState.status === 'SUCCESS' && (
        <div style={{ color: 'green' }}>{formState.message}</div>
      )}
    </noscript>
  );
};

export { useToastMessage };