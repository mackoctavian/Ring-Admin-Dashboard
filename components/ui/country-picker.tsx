"use client";
import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";
import { getCountries } from '@/lib/actions/system.actions';
import { Country } from '@/types';

interface Props {
    value?: string;
    onChange: (value: string) => void;
}

const CountrySelect: React.FC<Props> = ({ value, onChange }) => {
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const countriesData = await getCountries();
                setCountries(countriesData);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        }

        fetchCountries();
    }, []);

    return (
        <Select value={value}>
            <SelectTrigger>
                <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {countries && countries.length > 0 && countries.map((country: Country) => (
                        <SelectItem key={country.countryShortName} value={country.countryShortName}>
                            {country.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default CountrySelect;