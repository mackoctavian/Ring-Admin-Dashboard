import { ZodError } from 'zod';
//import { AppwriteException } from "node-appwrite";
import * as Sentry from "@sentry/nextjs";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 

export type FormState = {
  status: 'UNSET' | 'SUCCESS' | 'ERROR';
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
};

export const EMPTY_FORM_STATE: FormState = {
  status: 'UNSET' as const,
  message: '',
  fieldErrors: {},
  timestamp: Date.now(),
};

export const fromErrorToFormState = (error: unknown) => {
  Sentry.captureException(error);

  if (error instanceof ZodError){
    console.error('ZOD ERRor', error)


    return {
      status: 'ERROR' as const,
      //message: '',
      message: 'Please make sure all the fields marked with * are filled in correctly.',
      fieldErrors: error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  // }else if (error instanceof AppwriteException) {
  //   const errorMessage = getStatusMessage(error.code as HttpStatusCode);
  //   return {
  //     status: 'ERROR' as const,
  //     message: errorMessage,
  //     fieldErrors: {},
  //     timestamp: Date.now(),
  //   };
  } else if (error instanceof Error) {
    console.error('ERROR', error)


    return {
      status: 'ERROR' as const,
      message: error.message,
      fieldErrors: {},
      timestamp: Date.now(),
    };
  } else {

    console.error('UNKNOWN ERROR', error)

    return {
      status: 'ERROR' as const,
      message: 'An unknown error occurred',
      fieldErrors: {},
      timestamp: Date.now(),
    };
  }

};

export const toFormState = (
  status: FormState['status'],
  message: string
): FormState => {
  return {
    status,
    message,
    fieldErrors: {},
    timestamp: Date.now(),
  };
};