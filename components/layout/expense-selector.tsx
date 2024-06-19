
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
  value?: Expense;
  onChange: (value: Expense) => void;
}

const ExpenseSelector: React.FC<Props> = ({ value, onChange }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const expensesData = await list();
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    }
    fetchExpenses();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedExpense = expenses.find(exp => exp.$id === value);
    if (selectedExpense) {
      onChange(selectedExpense);
    }
  };

  return (
    <Select value={value ? value.$id : 'Select expense'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? `${formatDateTime( value.dueDate ).dateOnly} ${value.name}` : 'Select expense'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {expenses.map((expense) => (
          <SelectItem key={expense.$id} value={expense.$id}>
            {`${formatDateTime( expense.dueDate ).dateOnly} ${expense.name}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ExpenseSelector;