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
export const formattedDate = (date: string) => format(new Date(date), 'MMM dd, yyyy • h:mm a');
