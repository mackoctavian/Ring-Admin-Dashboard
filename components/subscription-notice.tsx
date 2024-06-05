import React, { createContext, useContext, useEffect, useState } from 'react';

import { SubscriptionContext } from '@/context/SubscriptionContext';
import { SubscriptionStatus } from '@/types/data-schemas';
import { SubscriptionContextType } from '@/types';

const SubscriptionNotice = () => {
  const { subscriptionStatus } = useContext<SubscriptionContextType>(SubscriptionContext);

  if (!subscriptionStatus || subscriptionStatus === SubscriptionStatus.OK || subscriptionStatus === SubscriptionStatus.TRIAL) {
    return null;
  }

  const statusMessages = {
    PAST_DUE: 'Your subscription is past due. Please update your payment details.',
    DUE: 'Your subscription payment is due soon. Please ensure your payment details are up to date.',
    EXPIRED: 'Your subscription has expired. Please renew your subscription.',
    ALMOST_DUE: 'Your subscription is almost due. Please prepare to renew your subscription.'
  };

  return (
    <div>
      <p>SUBSCRIPTION MESSAGE GOES HERE</p>
    </div>
  );
};

export default SubscriptionNotice;
