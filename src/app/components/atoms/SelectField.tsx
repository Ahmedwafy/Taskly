'use client';
import * as icons from '@/../public/icons/icons';
import Image from 'next/image';
import { forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  id?: string;
  name?: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  className?: string;
  optional?: string;
  requiredd?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  value?: string | number;
}

const SelectField = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      name,
      label,
      options,
      placeholder,
      description,
      className,
      optional,
      requiredd,
      disabled,
      error,
      onChange,
      onBlur,
      value,
    },
    ref,
  ) => {
    const errorId = error ? 'error' : undefined;

    return (
      <div className={className}>
        {/* Consistent Label Section */}
        <label
          htmlFor={id ?? name}
          className="text-[#4F5F7B] label-sm relative left-1"
        >
          {optional ? (
            <div className="flex justify-between w-full">
              <span>{label}</span>
              <span className="text-gray-400">{optional}</span>
            </div>
          ) : (
            <div>
              {requiredd ? (
                <div>
                  {label} <span className="text-red-500">*</span>
                </div>
              ) : (
                <div>{label}</div>
              )}
            </div>
          )}
        </label>

        {/* Dropdown Input Wrapper */}
        <div className="relative mt-2">
          <select
            id={id ?? name}
            ref={ref}
            name={name}
            value={value}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={`w-full p-3 border-gray-300 rounded-md appearance-none ${
              error ? 'bg-inputBgError' : 'bg-[#D7E2FF]'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom Chevron Arrow Icon overlay since appearance-none hides the native one */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <Image src={icons.dropDownArrow} alt="Drop Down" />
          </div>
        </div>

        {/* Description Text */}
        {description && (
          <p className="text-sm text-[#C3C6D6] text-[11px] mt-2 sm:flex hidden">
            {description}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p id={errorId} role="alert" className="text-sm text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';

export default SelectField;
