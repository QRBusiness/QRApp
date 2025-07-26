import {
  AREA_MANAGEMENT_TABLE,
  BRANCH_TABLE,
  BUSINESS_OWNER_TABLE,
  BUSINESS_TABLE,
  BUSINESS_TYPE_TABLE,
  CATEGORY_MANAGEMENT_TABLE,
  DASHBOARD_TABLE,
  GROUP_MANAGEMENT_TABLE,
  MENU_MANAGEMENT_TABLE,
  ORDER_MANAGEMENT_TABLE,
  PLAN_MANAGEMENT_TABLE,
  QR_MANAGEMENT_TABLE,
  STAFF_MANAGEMENT_TABLE,
  SUBCATEGORY_MANAGEMENT_TABLE,
} from '@/constants';
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

export const formattedDate = (date: string, formatString?: string) => {
  const d = new Date(date);
  d.setHours(d.getHours() - 1);
  return format(d, formatString || 'MMM dd, yyyy • h:mm a');
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

export const resetTableStorage = () => {
  removeFromLocalStorage(AREA_MANAGEMENT_TABLE + '_visibility'); //1
  removeFromLocalStorage(BUSINESS_OWNER_TABLE + '_visibility'); //2
  removeFromLocalStorage(BUSINESS_TABLE + '_visibility'); //3
  removeFromLocalStorage(BRANCH_TABLE + '_visibility'); //4
  removeFromLocalStorage(BUSINESS_TYPE_TABLE + '_visibility'); //5
  removeFromLocalStorage(QR_MANAGEMENT_TABLE + '_visibility'); //6
  removeFromLocalStorage(MENU_MANAGEMENT_TABLE + '_visibility'); //7
  removeFromLocalStorage(STAFF_MANAGEMENT_TABLE + '_visibility'); //8
  removeFromLocalStorage(ORDER_MANAGEMENT_TABLE + '_visibility'); //9
  removeFromLocalStorage(CATEGORY_MANAGEMENT_TABLE + '_visibility'); //10
  removeFromLocalStorage(SUBCATEGORY_MANAGEMENT_TABLE + '_visibility'); //11
  removeFromLocalStorage(PLAN_MANAGEMENT_TABLE + '_visibility'); //12
  removeFromLocalStorage(GROUP_MANAGEMENT_TABLE + '_visibility'); //13
  removeFromLocalStorage(DASHBOARD_TABLE + '_visibility'); //14
};

// check at least one permission in the list
export const havePermissions = (permissions: string[], permissionToCheck: string[]): boolean => {
  return permissions.some((permission) => permissionToCheck.includes(permission));
};
