// /context/UserContext
"use client";

import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { signIn, signUp, getLoggedInUser, logoutAccount } from '@/lib/actions/user.actions';
import { User, UserContextType, SignUpParams } from '@/types'

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const user = await getLoggedInUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await signIn({ email, password });
      setUser(user);
    } catch (error) {
      console.error('Failed to login', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: SignUpParams) => {
    setLoading(true);
    try {
      const user = await signUp(userData);
      setUser(user);
    } catch (error) {
      console.error('Failed to register', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutAccount();
      setUser(null);
    } catch (error) {
      console.error('Failed to logout', error);
    } finally {
      router.push("/sign-in");
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };