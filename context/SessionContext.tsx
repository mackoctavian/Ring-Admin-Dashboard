const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import { getLoggedInUser } from "@/lib/actions/user.actions";

interface SessionData {
    user: User | null;
}

interface SessionContextValue {
    sessionData: SessionData;
    sessionLoading: boolean;
  }

interface SessionProviderProps {
    children: ReactNode;
}
  
const SessionContext = createContext<SessionContextValue>({ sessionData: { user: null }, sessionLoading: true });

export const SessionProvider = ({ children, ...props }: SessionProviderProps) => {
    const [sessionData, setSessionData] = useState<SessionData>({ user: null });
    const [sessionLoading, setSessionLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const loggedInUser: User = await getLoggedInUser();            
            if (loggedInUser) {
                setSessionData({ user: loggedInUser });
            } else {
            // Handle error cases here
            console.error('Failed to fetch logged in user data');
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
