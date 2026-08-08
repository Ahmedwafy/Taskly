import { StylesConfig } from 'react-select';
import { TaskStatus } from '../enums';

type StatusConfig = {
  badge: string;
  dot: string;
  statusbar: string;
  task: string;
  mobile: string;
  colors: {
    bg: string;
    text: string;
  };
  chart: {
    color: string;
  };
};

// TO DO
export const DEFAULT_STATUS: StatusConfig = {
  badge: 'bg-[#D7E2FF] text-[#434654] font-bold text-[11px]',
  dot: 'bg-[#94A3B8]',
  statusbar: 'bg-[#D7E2FF]',
  task: 'bg-[#D7E2FF] text-neutral-100',
  mobile: 'bg-[#D7E2FF] text-[#434654]',
  colors: {
    bg: '#D7E2FF',
    text: '#434654',
  },
  chart: {
    color: '#E8EDFF',
  },
};

export const DONE_STATUS: StatusConfig = {
  badge: 'bg-[#82F9BE] text-[#002113] font-bold text-[11px]',
  dot: 'bg-[#004E32]',
  statusbar: 'bg-[#82F9BE]',
  task: 'bg-[#82F9BE]',
  mobile: 'bg-[#82F9BE] text-[#002113]',
  colors: {
    bg: '#82F9BE',
    text: '#002113',
  },
  chart: {
    color: '#82F9BE',
  },
};

export const BLUE_STATUS: StatusConfig = {
  badge: 'bg-[#CDDDFF] text-[#51617E] font-bold text-[11px]',
  dot: 'bg-[#94A3B8]',
  statusbar: 'bg-[#F7E49B]',
  task: 'bg-[#D7E2FF] text-neutral-100',
  mobile: 'bg-[#CDDDFF] text-[#51617E]',
  colors: {
    bg: '#CDDDFF',
    text: '#51617E',
  },
  chart: {
    color: '#F7E49B',
  },
};

export const QA_STATUS: StatusConfig = {
  badge: 'bg-[#EADCFF] text-[#4A148C] font-bold text-[11px]',
  dot: 'bg-[#6A1B9A]',
  statusbar: 'bg-[#6A1B9A]',
  task: 'bg-[#EADCFF] text-[#4A148C]',
  mobile: 'bg-[#EADCFF] text-[#4A148C]',
  colors: {
    bg: '#EADCFF',
    text: '#4A148C',
  },
  chart: {
    color: '#6A1B9A',
  },
};

export const REOPENED_STATUS: StatusConfig = {
  badge: 'bg-[#FFE3B3] text-[#7A4100] font-bold text-[11px]',
  dot: 'bg-[#B45300]',
  statusbar: 'bg-[#FFE3B3]',
  task: 'bg-[#FFE3B3] text-[#7A4100]',
  mobile: 'bg-[#FFE3B3] text-[#7A4100]',
  colors: {
    bg: '#FFE3B3',
    text: '#7A4100',
  },
  chart: {
    color: '#FFE3B3',
  },
};

export const READY_FOR_PRODUCTION_STATUS: StatusConfig = {
  badge: 'bg-[#B2F5EA] text-[#004D40] font-bold text-[11px]',
  dot: 'bg-[#00695C]',
  statusbar: 'bg-[#00695C]',
  task: 'bg-[#B2F5EA] text-[#004D40]',
  mobile: 'bg-[#B2F5EA] text-[#004D40]',
  colors: {
    bg: '#B2F5EA',
    text: '#004D40',
  },
  chart: {
    color: '#00695C',
  },
};

export const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  TO_DO: DEFAULT_STATUS,

  IN_PROGRESS: {
    badge: 'bg-[#CDDDFF] text-[#51617E] font-bold text-[11px]',
    dot: 'bg-primary',
    statusbar: 'bg-[#003D9B]',
    task: 'bg-[#0052CC1A] text-primary',
    mobile: 'bg-[#CDDDFF] text-[#374763]',
    colors: {
      bg: '#CDDDFF',
      text: '#51617E',
    },
    chart: {
      color: '#003D9B',
    },
  },

  BLOCKED: {
    badge: 'bg-[#FFDAD6] text-[#93000A] font-bold text-[11px]',
    dot: 'bg-[#BA1A1A]',
    statusbar: 'bg-[#BA1A1A]',
    task: 'bg-[#FFDAD6] text-[#93000A]',
    mobile: 'bg-[#FFDAD6] text-[#93000A]',
    colors: {
      bg: '#FFDAD6',
      text: '#93000A',
    },
    chart: {
      color: '#BA1A1A',
    },
  },

  DONE: DONE_STATUS,
  COMPLETED: DONE_STATUS,

  READY_FOR_QA: QA_STATUS,
  IN_REVIEW: BLUE_STATUS,
  REOPENED: REOPENED_STATUS,
  READY_FOR_PRODUCTION: READY_FOR_PRODUCTION_STATUS,
} as const;

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
