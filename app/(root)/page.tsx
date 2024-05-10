import React from 'react'
import BreadCrumb from "@/components/layout/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems = [{ title: "Home", link: "/" }];

const Home = () => {
    return (
        <>
          <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
            <BreadCrumb items={breadcrumbItems} />
    
            <div className="flex items-start justify-between">
              <Heading title={`Dashboard`} description="welcome to your slide dashboard" />
            </div>
            <Separator />
    
            <h1>Dashboard</h1>
          </div>
        </>
      );
}

export default Home