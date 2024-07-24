import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SubscriptionPlan } from "@/types";
import {getSubscriptionPlans} from "@/lib/actions/billing.actions";

interface Props {
    value?: SubscriptionPlan | null;
    onChange: (value: SubscriptionPlan | null) => void;
}

const SubscriptionPlanSelector: React.FC<Props> = ({ value, onChange }) => {
    const [subscriptionPlans, setSubscriptionPlan] = useState<SubscriptionPlan[]>([]);

    useEffect(() => {
        async function fetchSubscriptionPlans() {
            try {
                const subscriptionPlans = await getSubscriptionPlans();
                setSubscriptionPlan(subscriptionPlans);
            } catch (error) {
                console.error('Error fetching subscription plans:', error);
            }
        }
        fetchSubscriptionPlans();
    }, []);

    const handleSelectChange = (id: string) => {
        const selectedSubscriptionPlan = subscriptionPlans.find(subscriptionPlan => subscriptionPlan.$id === id);
        onChange(selectedSubscriptionPlan || null);
    };

    return (
        <Select value={value ? value.$id : ''} onValueChange={handleSelectChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select subscription plan">
                    {value ? value.name : 'Select subscription plan'}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {subscriptionPlans.map((subscriptionPlan) => (
                    <SelectItem className={`cursor-pointer`} key={subscriptionPlan.$id} value={subscriptionPlan.$id}>
                        {subscriptionPlan.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SubscriptionPlanSelector;