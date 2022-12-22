import { isSameSecond, parseISO } from 'date-fns';

// types
import { UserProfile } from '../@types';

//  Helper function to get auth tokens from query params.
export const JSONLocalStorage = {
  get(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  clear() {
    localStorage.clear();
  },
};

// Helper function to scroll to an element.
export function scrollToElement(element: HTMLElement) {
  if (typeof element?.scrollIntoView === 'function') {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Helper function to check if user-api user is "new", no modifications made.
export function isNewUser(user: Partial<UserProfile>) {
  const { created, modified } = user;
  return isSameSecond(parseISO(created!), parseISO(modified!));
}

// Helper function to remove trailing slashes from string
export function removeTrailingSlash(str: string) {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}
