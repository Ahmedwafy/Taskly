// === Date Format Helper ===
export const formatDate = (
  dateString?: string,
  variant: 'US' | 'EU' = 'US',
) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  // 'en-US' natively formats: "Jun 27, 2026"
  // 'en-GB' natively formats: "27 Jun 2026"
  const locale = variant === 'US' ? 'en-US' : 'en-GB';

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
