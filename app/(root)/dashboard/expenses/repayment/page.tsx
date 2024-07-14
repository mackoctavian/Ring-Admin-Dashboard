import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import RecordPaymentForm from "@/components/forms/RecordPaymentForm";

const breadcrumbItems = [{ title: "Expense", link: "/expenses" }, { title: "Repayment", link: "/repayment" } ];

const ExpensePaymentPage = async () => {
    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={`Record payment`} description={`Record expense repayment`} />
                </div>
                <Separator />

                <RecordPaymentForm />
            </div>
        </>
    );
};

export default ExpensePaymentPage;
