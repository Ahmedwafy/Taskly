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

//  === Helper to style status badges based on status value from response ===
export const getStatusStyle = (status: string) => {
  switch (status) {
    case 'COMPLETED':
    case 'DONE':
      return 'bg-[#82F9BE] text-[#002113] font-bold text-[11px]';

    case 'IN_PROGRESS':
      return 'bg-primary text-white font-bold text-[11px]';

    case 'BLOCKED':
      return 'bg-[#FFDAD6] text-[#93000A] font-bold text-[11px]';

    case 'READY_FOR_QA':
    case 'IN_REVIEW':
    case 'REOPENED':
    case 'READY_FOR_PRODUCTION':
      return 'bg-[#CDDDFF] text-[#51617E] font-bold text-[11px]';

    default: // TO_DO / BACKLOG
      return 'bg-[#D7E2FF] text-[#434654] font-bold text-[11px]';
  }
};

/**
 * Generates up to 2 uppercase initials from a name string.
 * @param {string} name - The full name (e.g., "John Doe", "  sarah   lee ")
 * @returns {string} - The resulting initials (e.g., "JD", "SL")
 */
export const getInitials = (name: string) => {
  return (name || '')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};
