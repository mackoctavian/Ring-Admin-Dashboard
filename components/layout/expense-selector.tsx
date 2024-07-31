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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const expensesData = await list(status);
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, [status]);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId);
  };

  const selectedExpense = expenses.find(exp => exp.$id === value);

  //@ts-ignore
  const formatExpenseLabel = (expense: Expense) => `${formatDateTime(expense.dueDate).dateOnly} ${expense.name}`;

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue>
            {loading ? 'Loading...' : (selectedExpense ? formatExpenseLabel(selectedExpense) : 'Select expense')}
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