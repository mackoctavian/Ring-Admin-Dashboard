import React, { useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const SlugGenerator = ({ placeholder, field, loading }) => {
    const [value, setValue] = useState('');
    const [slug, setSlug] = useState('');

    const handleValueChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        const newSlug = newValue
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
        setSlug(newSlug);
    };

    return (
        <>
        <Input disabled={loading} placeholder={placeholder} {...field} onChange={handleValueChange}/>
        <small>Slug: {slug}</small>
        </>
    );
};

export default SlugGenerator;
