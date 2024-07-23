import SubscriptionForm from './subscription-form'
import {getSubscription} from "@/lib/actions/business.actions"
import {SubscriptionDetails} from "@/types";

export default async function SubscriptionsPage() {
    const subscription : null | undefined | SubscriptionDetails = await getSubscription();
    return (
        <div className='space-y-6'>
            <SubscriptionForm subscriptionDetails={subscription}/>
        </div>
    )
}
