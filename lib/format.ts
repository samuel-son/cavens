/**
 * Currency-agnostic formatting utilities
 * Localization-ready
 */

export function formatCurrency(amount: number, currency = 'XAF'): string {
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatDate(iso: string, locale = 'en'): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string, locale = 'en'): string {
  return new Date(iso).toLocaleString(locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
