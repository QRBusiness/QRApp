import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This utility functions for localStorage operations
export const saveToLocalStorage = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null || serializedValue === undefined) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error loading from localStorage', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage', error);
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
};

export const saveToSessionStorage = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to sessionStorage', error);
  }
};
export const loadFromSessionStorage = (key: string, defaultValue: any) => {
  try {
    const serializedValue = sessionStorage.getItem(key);
    if (serializedValue === null || serializedValue === undefined) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error loading from sessionStorage', error);
    return defaultValue;
  }
};
export const removeFromSessionStorage = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from sessionStorage', error);
  }
};

export const formattedDate = (date: string) => {
  const d = new Date(date);
  d.setHours(d.getHours() - 1);
  return format(d, 'MMM dd, yyyy • h:mm a');
};

export const getTypeOfField = (fieldName: string): string => {
  switch (fieldName) {
    case 'email':
      return 'email';
    case 'phone':
      return 'tel';
    case 'contact':
      return 'tel';
    case 'password':
      return 'password';
    case 'confirmPassword':
      return 'password';
    case 'number':
      return 'number';
    default:
      return 'text';
  }
};
