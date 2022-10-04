export function scrollToElement(element: HTMLElement) {
  if (typeof element?.scrollIntoView === 'function') {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
