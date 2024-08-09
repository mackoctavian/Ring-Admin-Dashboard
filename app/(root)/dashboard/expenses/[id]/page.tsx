import BreadCrumb from "@/components/layout/breadcrumb"
import { getItem } from '@/lib/actions/expense.actions'
import {Expense} from "@/types"
import ExpenseForm from "@/components/forms/ExpenseForm"
import {notFound} from "next/navigation"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

export default async function ExpensePage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Expense | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            console.error("Error loading data:", error);
            throw new Error("Failed to load expense data");
        }
    }

    const breadcrumbItems = [{ title: "Expenses", link: "/dashboard/expenses" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <ExpenseCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const ExpenseCard = ({ isNewItem, item }: { isNewItem: boolean; item: Expense | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create expense" : "Edit expense"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Record new expense" : "Edit your expense"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ExpenseForm item={item} />
        </CardContent>
    </Card>
)