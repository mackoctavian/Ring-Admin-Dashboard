"use client";

import { useEffect, useState } from 'react';
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { ReloadIcon } from "@radix-ui/react-icons"
import { getTempBusinessInfo } from '@/lib/actions/business.actions';
import { Business } from "@/types";
import BusinessForm from "@/components/forms/BusinessForm";

const breadcrumbItems = [{ title: "Business", link: "/business-settings" }, { title: "New", link: "" }];

const BusinessSettingsPage = () => {
    
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading title="Business Settings" description="Configure some settings about your business" />
      </div>
      <Separator />
      <BusinessForm  />
    </div>
  );
};

export default BusinessSettingsPage;