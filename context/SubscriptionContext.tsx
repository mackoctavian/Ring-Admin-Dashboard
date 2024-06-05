"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { getSubscriptionStatus } from '@/lib/actions/business.actions';

const defaultSubscriptionContext = {
    subscriptionStatus: null,
  };

export const SubscriptionContext = createContext(defaultSubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
