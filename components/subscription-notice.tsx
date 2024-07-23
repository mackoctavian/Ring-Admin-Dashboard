'use client'

import {getSubscription} from '@/lib/actions/business.actions';
import {SubscriptionStatus} from '@/types/data-schemas';
import {useEffect, useState} from 'react';
import Logo from './layout/logo';
import {SubscriptionDetails} from "@/types";
import {formatDateTime} from "@/lib/utils";

const SubscriptionNotice = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(SubscriptionStatus.OK);

  //TODO: Add animations
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const subscription : null | undefined | SubscriptionDetails = await getSubscription();
        if ( subscription == null ){ setSubscriptionStatus(SubscriptionStatus.EXPIRED) } else { setSubscriptionStatus(subscription.status) }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  if (!subscriptionStatus || subscriptionStatus === 'OK') {
    return null;
  }

  const statusMessages = {
    PAST_DUE: 'Your subscription is past due. Please update your payment details.',
    DUE: 'Your subscription payment is due soon. Please ensure your payment details are up to date.',
    EXPIRED: 'Your subscription has expired. Please renew your subscription.',
    ALMOST_DUE: 'Your subscription is almost due. Please prepare to renew your subscription.',
    TRIAL: `Your trial period is ending soon. Please prepare to renew your subscription.`
  };

  const message = statusMessages[subscriptionStatus];

  return (
    <div id="subscriptionBanner" className="fixed z-50 flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 -translate-x-1/2 bg-destructive text-destructive-foreground border-destructive rounded-lg shadow-sm lg:max-w-7xl left-1/2 top-6 transition-transform duration-700 transition-[opacity,transform] translate-y-0 opacity-100">
      <div className="flex flex-col items-start mb-3 me-4 md:items-center md:flex-row md:mb-0">
        <div className="flex items-center mb-2 border-gray-200 md:pe-4 md:me-4 md:border-e md:mb-0 dark:border-gray-600">
          <div className="relative w-full max-w-[80px]">
              <Logo inverse={true} />
          </div>
        </div>
        <p className="flex items-center text-sm font-normal text-white">
          {message}
        </p>
      </div>
      <div className="flex items-center flex-shrink-0">
        <a href={`/dashboard/settings/subscription`} className="px-5 py-2 me-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Renew subscription</a>
      </div>
    </div>
  );
};

export default SubscriptionNotice;