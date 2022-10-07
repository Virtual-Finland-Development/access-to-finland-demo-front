//  Helper function to get auth tokens from query params.
export const JSONLocalStorage = {
  get(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

// Helper function to scroll to an element.
export function scrollToElement(element: HTMLElement) {
  if (typeof element?.scrollIntoView === 'function') {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
