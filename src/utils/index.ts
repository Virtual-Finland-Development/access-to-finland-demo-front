import { isSameSecond, parseISO } from 'date-fns';

// types
import { UserProfile } from '../@types';

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

/**
 *
 * @param myEnum
 * @param enumValue
 * @returns
 */
export function getEnumKeyFromValue<T extends object>(
  myEnum: T,
  enumValue: T[keyof T]
) {
  const index = Object.values(myEnum).indexOf(enumValue as T[keyof T]);
  return Object.keys(myEnum)[index];
}
