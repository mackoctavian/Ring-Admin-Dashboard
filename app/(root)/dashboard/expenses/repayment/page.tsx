import BreadCrumb from "@/components/layout/breadcrumb";
import RecordPaymentForm from "@/components/forms/RecordPaymentForm";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function ExpensePaymentPage() {

    const breadcrumbItems = [{ title: "Expenses", link: "/dashboard/expenses" }, { title: "Repayment", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <RepaymentCard />
        </div>
    );
}

const RepaymentCard = () => (
    <Card>
        <CardHeader>
            <CardTitle>Record payment</CardTitle>
            <CardDescription>Record a repayment for your expenses</CardDescription>
        </CardHeader>
        <CardContent>
            <RecordPaymentForm />
        </CardContent>
    </Card>
)