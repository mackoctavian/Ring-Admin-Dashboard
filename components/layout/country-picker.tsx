"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";

interface Country {
    id: number;
    iso: string;
    name: string;
    nicename: string;
    iso3: string;
    numcode: number;
    phonecode: number;
}

interface Props {
    value?: string;
    onChange: (value: string) => void;
}

const CountrySelect: React.FC<Props> = ({ value, onChange }) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get<Country[]>('http://localhost:8080/api/countries')
            .then(response => {
                setCountries(response.data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <Select value={value}>
            <SelectTrigger>
                <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select country</SelectLabel>
                    {countries.map((country) => (
                        <SelectItem key={country.iso} value={country.iso}>
                            {country.nicename}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default CountrySelect;
