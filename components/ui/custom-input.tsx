/* eslint-disable no-unused-vars */
import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import { Control } from "react-hook-form";
import PhoneInput from 'react-phone-number-input'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./form";
import { Input } from "./input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./select";
import { Textarea } from "./textarea";
import {Checkbox} from "./checkbox";
import 'react-phone-number-input/style.css'

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
    CUSTOM_SELECTOR = "customSelect",
}

interface CustomProps {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldType: FormFieldType;
    type?: string;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
    switch (props.fieldType) {
        case FormFieldType.INPUT:
            return (
                <>
                    {props.iconSrc && (
                        <Image
                            src={props.iconSrc}
                            height={24}
                            width={24}
                            alt={props.iconAlt || "icon"}
                            className="ml-2"
                        />
                    )}
                    <FormControl>
                        <Input type={props.type} placeholder={props.placeholder} {...field} />
                    </FormControl>
                </>
            );
        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={props.placeholder}
                        {...field}
                        disabled={props.disabled}
                    />
                </FormControl>
            );
        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry="TZ"
                        placeholder={props.placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </FormControl>
            );
        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox
                            id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <label htmlFor={props.name} className="checkbox-label">
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            );
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border">
                    <Image
                        src="/icons/icons/calendar.svg"
                        height={18}
                        width={18}
                        alt="Select date"
                        className="ml-2 mr-2"
                    />
                    <FormControl>
                        <ReactDatePicker
                            showTimeSelect={props.showTimeSelect ?? false}
                            selected={field.value}
                            onChange={(date: Date | null) => field.onChange(date)}
                            timeInputLabel="Time:"
                            dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
                            wrapperClassName="date-picker"
                        />
                    </FormControl>
                </div>
            );

        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={props.placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            );
        case FormFieldType.CUSTOM_SELECTOR:
            return (
                <FormControl>
                    {props.renderSkeleton && props.renderSkeleton(field)}
                </FormControl>
            );
        case FormFieldType.SKELETON:
            return props.renderSkeleton ? props.renderSkeleton(field) : null;
        default:
            return null;
    }
};

const CustomFormField = (props: CustomProps) => {
    const { control, name, label } = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    {props.fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel className="shad-input-label">{label}</FormLabel>
                    )}
                    <RenderInput field={field} props={props} />

                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default CustomFormField;