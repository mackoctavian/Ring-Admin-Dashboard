import BusinessRegistrationForm from '@/components/forms/BusinessRegistrationForm'
import {getBusiness} from "@/lib/actions/business.actions";
import {redirect} from "next/navigation";

const BusinessRegistration = async () => {
    const business = await getBusiness()

    if( business != null ){ redirect('/dashboard') }

    return (
        <section className="flex-center size-full max-sm:px-6">
            <BusinessRegistrationForm/>
        </section>
    )
}

export default BusinessRegistration