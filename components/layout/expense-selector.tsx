import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/expense.actions"
import { Expense } from "@/types";
import { formatDateTime } from "@/lib/utils"

interface Props {
  value?: string;
  status?: string;
  onChange: (value: string) => void;
}

const ExpenseSelector: React.FC<Props> = ({ value, onChange, status }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        setIsLoading(true);
        const expensesData = await list(status);
        setExpenses(expensesData || []); // Ensure it's always an array
        setError(null);
      } catch (error: any) {
        setError("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    }
    fetchExpenses();
  }, [status]);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId === 'default' ? '' : selectedId);
  };

  const selectedExpense = expenses.find(exp => exp.$id === value);

  const formatExpenseLabel = (expense: Expense) => {
    if (!expense || !expense.dueDate) return 'Invalid expense';
    //@ts-ignore
    return `${formatDateTime(expense.dueDate).dateOnly} ${expense.name || 'Unnamed expense'}`;
  };

  if (isLoading) {
    return <div className={`text-sm text-muted-foreground`}>Loading expenses...</div>;
  }

  if (error) {
    return <div className={`text-sm text-destructive-foreground`}>Error: could not load expenses</div>;
  }

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {value ? formatExpenseLabel(selectedExpense as Expense) : 'Select expense'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" disabled>
            Select expense
          </SelectItem>
          {expenses.map((expense) => (
              <SelectItem key={expense.$id} value={expense.$id}>
                {formatExpenseLabel(expense)}
              </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
};

export default ExpenseSelector;