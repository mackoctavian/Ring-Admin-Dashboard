import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { Business } from "@/types";
import BusinessForm from "@/components/forms/BusinessForm";
import { getCurrentBusiness } from '@/lib/actions/business.actions';
import { notFound } from "next/navigation";

const breadcrumbItems = [{ title: "Business", link: "/business-settings" }, { title: "Edit business details", link: "" }];

const BusinessSettingsPage = async () => {
  let item: Business;

  try {
      item = await getCurrentBusiness();
  } catch (error) {
      console.error("Error loading business data", error)
      notFound()
  }
    
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading title="Business Settings" description="Configure some settings about your business" />
      </div>
      <Separator />
      <BusinessForm item={item} />
    </div>
  );
};

export default BusinessSettingsPage;