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
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
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
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === 'password';
    const errorId = error ? 'error' : undefined;

    return (
      <div className={className}>
        <label
          htmlFor={id ?? name}
          className="text-[#4F5F7B] label-sm relative left-1"
        >
          {label}
        </label>

        <div className="relative mt-2">
          <input
            id={id ?? name}
            ref={ref}
            name={name}
            type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={`w-full p-3 pr-12 border-gray-300  rounded-md ${error ? `bg-(--inputBgError)` : `bg-[#D7E2FF]`}`}
          />
          {/* --inputBgError */}
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:cursor-pointer"
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

Input.displayName = 'Input';

export default Input;
