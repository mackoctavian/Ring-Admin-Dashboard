import { Separator } from '@/components/ui/separator'
import BusinessForm from "@/components/forms/BusinessForm";
import { getCurrentBusiness } from '@/lib/actions/business.actions';
import { Business } from "@/types";

const BusinessSettingsPage = async () => {
  let item: Business;

  try {
      item = await getCurrentBusiness();
  } catch (error) {
      throw new Error("Error loading business data" + error);
  }
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Business settings</h3>
        <p className='text-sm text-muted-foreground'>
          Manage your business settings. Configure some settings about your business.
        </p>
      </div>
      <Separator />
      <BusinessForm item={item} />
    </div>
  )
}

export default BusinessSettingsPage