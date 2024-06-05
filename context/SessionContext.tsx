const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {getCurrentBusiness} from '@/lib/actions/business.actions'
import {getCurrentBranch} from '@/lib/actions/branch.actions'
import { Branch } from '@/types'

interface SessionData {
    business: string | null;
    branch: Branch | null;
}

interface SessionContextValue {
    sessionData: SessionData;
    sessionLoading: boolean;
  }

interface SessionProviderProps {
    children: ReactNode;
}
  
const SessionContext = createContext<SessionContextValue>({ sessionData: { business: null, branch: null }, sessionLoading: true });

export const SessionProvider = ({ children, ...props }: SessionProviderProps) => {
    const [sessionData, setSessionData] = useState<SessionData>({ business: null, branch: null });
    const [sessionLoading, setSessionLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
        try {
            //const businessRes = await getCurrentBusiness();
            const branchRes = await getCurrentBranch();

            if (branchRes) {
                setSessionData({ business: '', branch: branchRes });
            } else {
            // Handle error cases here
            console.error('Failed to fetch business or branch data');
            }


        } catch (error) {
            console.error('Error initializing session data');
            if(env == "development"){ console.error(error); }
            Sentry.captureException(error);
        } finally {
            setSessionLoading(false);
        }
        };

        fetchData();
    }, []);

  return (
    <SessionContext.Provider value={{ sessionData, sessionLoading }} {...props}>
          {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
