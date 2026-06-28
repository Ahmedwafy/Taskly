// src → components → atoms → Input.tsx

'use client';

import { forwardRef, useState } from 'react';
import * as icons from '../../../../public/icons/icons';
import Image from 'next/image';

interface InputProps {
  id?: string;
  name?: string;
  label?: string | string[];
  type?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  value?: string | number;
  multiline?: boolean;
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
      type,
      placeholder,
      description,
      className,
      value,
      onChange,
      error,
      onBlur,
      multiline,
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
    const isPasswordField = type === 'password' && !multiline;
    const errorId = error ? 'error' : undefined;
    const maxLen = maxLength ?? 500;

    const displayedValue =
      value !== undefined && value !== null ? String(value) : internalValue;

    return (
      <div className={className}>
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
            //
          )}
        </label>

        <div className="relative mt-2">
          {multiline ? (
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
            <input
              id={id ?? name}
              ref={ref as React.Ref<HTMLInputElement>}
              name={name}
              type={
                isPasswordField ? (showPassword ? 'text' : 'password') : type
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
              className={`w-full p-3 pr-12 border-gray-300 rounded-md ${error ? `bg-inputBgError` : `bg-[#D7E2FF]`} disabled:opacity-60 disabled:cursor-not-allowed ${epicStyle}`}
            />
          )}

          {isPasswordField && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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

        <p className="text-sm text-[#C3C6D6] text-[11px] mt-2 sm:flex hidden">
          {description}
        </p>

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
