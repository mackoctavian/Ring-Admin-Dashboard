'use client';

import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import {useCallback, useEffect, useState} from "react";

const DAYS: Option[] = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
];

interface Props {
    placeholder?: string;
    onChange: (selectedDays: string[]) => void;
    value?: string[] | null;
}

export default function DaysSelector({ placeholder, onChange, value }: Props) {
    const [selectedDays, setSelectedDays] = useState<Option[]>([]);

    useEffect(() => {
        if (Array.isArray(value)) {
            setSelectedDays(value.map(day => ({ label: day, value: day })));
        } else {
            setSelectedDays([]);
        }
    }, [value]);

    const handleChange = useCallback((selected: Option[] | null) => {
        const newSelectedDays = selected || [];
        setSelectedDays(newSelectedDays);
        const selectedValues = newSelectedDays.map(option => option.value);
        onChange(selectedValues);
    }, [onChange]);

    return (
        <MultipleSelector
            value={selectedDays}
            onChange={handleChange}
            options={DAYS}
            placeholder={placeholder}
            emptyIndicator={
                <p className="text-center text-sm leading-10 text-gray-600 dark:text-gray-400">
                    Please select days
                </p>
            }
        />
    );
}