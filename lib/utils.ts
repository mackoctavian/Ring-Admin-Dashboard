/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//generate sku
export const generateSKU = (productName: string) => {
  const prefix = 'sku';
  const uniquePart = nanoid(6).toLowerCase();
  const formattedName = productName.replace(/\s+/g, '').toLowerCase().substring(0, 4); // First 5 characters
  return `${prefix}-${formattedName}-${uniquePart}`;
};

// FORMAT DATE TIME
export const formatDateTime = (input: string) => {
  let date: Date;

  if (input.includes('T') || input.includes('-')) {
    date = new Date(input);
  } else {
    // If the input is time-only like "00:30", assume today's date
    const today = new Date();
    const [hours, minutes] = input.split(':').map(Number);
    date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
  }

  const locale = "en-US"; // Use a consistent locale
  const timeZone = "UTC"; // Use a consistent time zone

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timeZone,
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timeZone,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    timeZone: timeZone,
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timeZone,
  };

  const formattedDateTime: string = date.toLocaleString(locale, dateTimeOptions);
  const formattedDateDay: string = date.toLocaleString(locale, dateDayOptions);
  const formattedDate: string = date.toLocaleString(locale, dateOptions);
  const formattedTime: string = date.toLocaleString(locale, timeOptions);

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};


export function formatAmount(value: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 2,
  });

  return formatter.format(value);
}

export function formatPercentage(value: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    currency: "%",
    minimumFractionDigits: 1,
  });

  return formatter.format(value);
}

export function formatNumber(value: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};