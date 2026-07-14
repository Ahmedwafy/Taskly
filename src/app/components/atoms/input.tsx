'use client';

import { forwardRef, useState } from 'react';
import * as icons from '../../../../public/icons/icons';
import Image from 'next/image';
import SearchIcon from '@/../public/svgIcons/SearchIcon.svg';

interface InputProps {
  id?: string;
  name?: string;
  label?: string | string[];
  type?: string;
  variant?: 'text' | 'password' | 'search' | 'textarea';
  placeholder?: string;
  description?: string;
  className?: string;
  value?: string | number;
  rows?: number;
  optional?: string;
  maxLength?: number;
  requiredd?: boolean;
  error?: string;
  disabled?: boolean;
  min?: string | number;
  epicStyle?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const InputField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      id,
      name,
      label,
      type = 'text',
      variant = 'text',
      placeholder,
      description,
      className,
      value,
      onChange,
      error,
      onBlur,
      rows,
      optional,
      maxLength,
      requiredd,
      disabled,
      epicStyle,
      min,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const errorId = error ? 'error' : undefined;
    const maxLen = maxLength ?? 500;

    const displayedValue =
      value !== undefined && value !== null ? String(value) : internalValue;

    return (
      <div className={className}>
        {/* Label block */}
        {label && (
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
        )}

        <div className="relative mt-2 h-full">
          {variant === 'textarea' ? (
            /* ================= TEXTAREA VARIANT ================= */
            <div className="flex flex-col">
              <textarea
                id={id ?? name}
                ref={ref as React.Ref<HTMLTextAreaElement>}
                name={name}
                rows={rows ?? 4}
                placeholder={placeholder}
                value={displayedValue}
                maxLength={maxLen}
                disabled={disabled}
                onChange={(e) => {
                  if (value === undefined || value === null)
                    setInternalValue(e.target.value);
                  if (onChange) onChange(e);
                }}
                onBlur={onBlur}
                aria-invalid={!!error}
                aria-describedby={errorId}
                className={`w-full p-3 border-gray-300 rounded-md ${error ? `bg-inputBgError` : `bg-[#D7E2FF]`} disabled:opacity-60 disabled:cursor-not-allowed`}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {displayedValue.length}/{maxLen}
              </div>
            </div>
          ) : (
            /* ================= STANDARD INPUTS (Text, Password, Search) ================= */
            // <div className="relative w-full border border-red-400 pt-15">
            <div className="relative w-full">
              <input
                id={id ?? name}
                ref={ref as React.Ref<HTMLInputElement>}
                name={name}
                type={
                  variant === 'password'
                    ? showPassword
                      ? 'text'
                      : 'password'
                    : type
                }
                placeholder={placeholder}
                value={displayedValue}
                disabled={disabled}
                onChange={(e) => {
                  if (value === undefined || value === null)
                    setInternalValue(e.target.value);
                  if (onChange) onChange(e);
                }}
                min={min}
                onBlur={onBlur}
                aria-invalid={!!error}
                aria-describedby={errorId}
                className={`w-full p-3 border-gray-300 rounded-md ${error ? `bg-inputBgError` : `bg-[#D7E2FF]`} 
                disabled:opacity-60 disabled:cursor-not-allowed ${epicStyle} 
                  ${variant === 'search' ? 'pl-12' : ''} 
                  ${variant === 'password' ? 'pr-12' : ''}
                `}
              />

              {/* SEARCH ICON */}
              {variant === 'search' && (
                <span className="absolute left-4 inset-y-0 flex items-center pointer-events-none">
                  <SearchIcon className="scale-150" />
                </span>
              )}

              {/* PASSWORD TOGGLE BUTTON */}
              {variant === 'password' && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3.5 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Image
                    src={icons.Eye}
                    alt="Toggle password visibility"
                    width={16}
                    height={16}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {description && (
          <p className="text-sm text-[#C3C6D6] text-[11px] mt-2 sm:flex hidden">
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-sm text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = 'InputField';

export default InputField;
