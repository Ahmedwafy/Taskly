export const STATUS_CONFIG = {
  DONE: {
    badge: 'bg-[#82F9BE] text-[#002113] font-bold text-[11px]',
    dot: 'bg-[#82F9BE]',
    task: 'bg-[#82F9BE]',
    mobile: 'bg-[#82F9BE] text-[#002113]',
    colors: {
      bg: '#82F9BE',
      text: '#002113',
    },
  },

  COMPLETED: {
    badge: 'bg-[#82F9BE] text-[#002113] font-bold text-[11px]',
    dot: 'bg-[#82F9BE]',
    task: 'bg-[#82F9BE]',
    mobile: 'bg-[#82F9BE] text-[#002113]',
    colors: {
      bg: '#82F9BE',
      text: '#002113',
    },
  },

  IN_PROGRESS: {
    badge: 'bg-[#CDDDFF] text-[#51617E] font-bold text-[11px]',
    dot: 'bg-primary',
    task: 'bg-[#0052CC1A] text-primary',
    mobile: 'bg-[#CDDDFF] text-[#374763]',
    colors: {
      bg: '#CDDDFF',
      text: '#51617E',
    },
  },

  BLOCKED: {
    badge: 'bg-[#FFDAD6] text-[#93000A] font-bold text-[11px]',
    dot: 'bg-[#BA1A1A]',
    task: 'bg-[#FFDAD6] text-[#93000A]',
    mobile: 'bg-[#FFDAD6] text-[#93000A]',
    colors: {
      bg: '#FFDAD6',
      text: '#93000A',
    },
  },

  READY_FOR_QA: {
    badge: 'bg-[#CDDDFF] text-[#51617E] font-bold text-[11px]',
    dot: 'bg-[#94A3B8]',
    task: 'bg-[#D7E2FF] text-neutral-100',
    mobile: 'bg-[#CDDDFF] text-[#51617E]',
    colors: {
      bg: '#CDDDFF',
      text: '#51617E',
    },
  },

  IN_REVIEW: {
    badge: 'bg-[#CDDDFF] text-[#51617E] font-bold text-[11px]',
    dot: 'bg-[#94A3B8]',
    task: 'bg-[#D7E2FF] text-neutral-100',
    mobile: 'bg-[#CDDDFF] text-[#51617E]',
    colors: {
      bg: '#CDDDFF',
      text: '#51617E',
    },
  },

  REOPENED: {
    badge: 'bg-[#CDDDFF] text-[#51617E] font-bold text-[11px]',
    dot: 'bg-[#94A3B8]',
    task: 'bg-[#D7E2FF] text-neutral-100',
    mobile: 'bg-[#CDDDFF] text-[#51617E]',
    colors: {
      bg: '#CDDDFF',
      text: '#51617E',
    },
  },

  READY_FOR_PRODUCTION: {
    badge: 'bg-[#CDDDFF] text-[#51617E] font-bold text-[11px]',
    dot: 'bg-[#94A3B8]',
    task: 'bg-[#D7E2FF] text-neutral-100',
    mobile: 'bg-[#CDDDFF] text-[#51617E]',
    colors: {
      bg: '#CDDDFF',
      text: '#51617E',
    },
  },

  DEFAULT: {
    badge: 'bg-[#D7E2FF] text-[#434654] font-bold text-[11px]',
    dot: 'bg-[#94A3B8]',
    task: 'bg-[#D7E2FF] text-neutral-100',
    mobile: 'bg-[#D7E2FF] text-[#434654]',
    colors: {
      bg: '#D7E2FF',
      text: '#434654',
    },
  },
} as const;

import { StylesConfig } from 'react-select';

export type SelectOption = {
  value: string;
  label: string;
};

export const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base) => ({
    ...base,
    border: 'none',
    borderRadius: '8px',
    minHeight: '40px',
    boxShadow: 'none',
    cursor: 'pointer',
    backgroundColor: 'white',
    fontSize: '14px',
    fontWeight: 500,
  }),

  singleValue: (base) => ({
    ...base,
    color: '#0f172a',
    fontWeight: 500,
  }),

  dropdownIndicator: (base) => ({
    ...base,
    padding: '4px',
  }),

  indicatorSeparator: () => ({
    display: 'none',
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    overflow: 'hidden',
    zIndex: 50,
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#F3F4F6'
      : state.isFocused
        ? '#F9FAFB'
        : 'white',
    color: '#1F2937',
    cursor: 'pointer',
    fontWeight: 500,
  }),
};
