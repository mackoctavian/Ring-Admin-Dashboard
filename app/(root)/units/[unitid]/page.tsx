'use client'

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getProductUnit } from '@/lib/actions/business.actions';
import { ProductUnit } from "@/types";
import ProductUnitForm from "@/components/forms/ProductUnitForm";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

const breadcrumbItems = [{ title: "Units", link: "/units" }];

const ProductUnitPage = ({ params }: { params: { unitid: string } }) => {
    const router = useRouter();
    const [unit, setUnit] = useState<ProductUnit | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingPercentage, setLoadingPercentage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                if (params.unitid) {
                    const total = 100;
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress = Math.min(progress + Math.random() * 10, total);
                        setLoadingPercentage(progress);
                    }, 200);

                    const data: ProductUnit = await getProductUnit(params.unitid);
                    setUnit(data);

                    clearInterval(interval);
                }
            } catch (error) {
                console.error(error);
                toast("Error loading unit.");
                router.push('/units');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.unitid) {
            fetchData();
        }
    }, [params.unitid, router, params]);

    if (!params.unitid) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Progress value={loadingPercentage.toFixed(0)} className="w-[60%]" />
            </div>
        );
    }

    if (unit === null) {
        return null;
    }

    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={params.unitid ? `Edit product unit` : `Create product unit`} description={params.unitid ? "Edit your product unit" : "Add new product unit to your business"} />
                </div>
                <Separator />

                <ProductUnitForm unit={unit} />
            </div>
        </>
    );
};

export default ProductUnitPage;