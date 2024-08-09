import * as React from "react";
import SubscriptionForm from './subscription-form'
import {getSubscription} from "@/lib/actions/business.actions"
import {SubscriptionDetails} from "@/types";
import {Heading} from "@/components/ui/heading";
import {formatDateTime} from "@/lib/utils";
import {SubscriptionStatus} from "@/types/data-schemas";
import SubscriptionModal from "@/components/layout/subscription-modal";

export default async function SubscriptionsPage() {
    const subscription : null | undefined | SubscriptionDetails = await getSubscription();
    const formattedNextDue = formatDateTime(subscription!.nextDue.toString()).dateOnly

    const statusMessages = {
        PAST_DUE: 'Your subscription is past due. Please update your payment details.',
        DUE: 'Your subscription payment is due on ${formattedNextDue}. Please ensure your payment details are up to date.',
        EXPIRED: 'Your subscription expired on ${formattedNextDue}. Please renew your subscription.',
        ALMOST_DUE: 'Your subscription is due on ${formattedNextDue}. Please prepare to renew your subscription.',
        TRIAL: `Your trial period is ending on ${formattedNextDue}. Please prepare to renew your subscription.`,
        OK: `Your account is active until ${formattedNextDue}`
    };

    const message = statusMessages[subscription?.status || SubscriptionStatus.EXPIRED];

    return (
        <div className='space-y-6'>
            <div className="flex items-start justify-between">
                <Heading title={`Current subscription`} description={message}/>

                <SubscriptionModal />
            </div>

            <SubscriptionForm />
        </div>
    )
}
