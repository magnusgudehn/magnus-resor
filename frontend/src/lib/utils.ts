import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('sv-SE');
}

export function formatDateTime(date: string) {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.warn('Invalid date:', date);
      return '';
    }
    // Format: YYYY-MM-DDTHH:mm
    return `${d.toISOString().split('.')[0].slice(0, -3)}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
