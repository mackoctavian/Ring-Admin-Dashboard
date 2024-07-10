'use client';

import * as React from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Field } from 'react-hook-form';

const OPTIONS: Option[] = [
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
    field: Field;
  }

export default function ({ placeholder, field }: Props) {
    return (
        <MultipleSelector
            {...field}
            defaultOptions={OPTIONS}
            placeholder={placeholder}
            emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400"> no results found. </p>
            }
        />
    ); 
}
