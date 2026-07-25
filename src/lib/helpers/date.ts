export const formatDate = (
  dateString?: string,
  variant: 'US' | 'EU' = 'US',
) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return '';

  const locale = variant === 'US' ? 'en-US' : 'en-GB';

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateShort = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

export const formatMonthYear = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

export const formatYear = (date: Date) => date.getFullYear();

export const formatDateISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export const getStartOfWeek = (date: Date) => {
  const d = new Date(date);

  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(d.setDate(diff));
};

export const getDaysInRange = (startDate: Date, endDate: Date): Date[] => {
  const days: Date[] = [];

  const current = new Date(startDate);

  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};
