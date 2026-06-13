'use client';
import { ReactNode } from 'react';

interface ButtonTypes {
  name?: string;
  error?: string;
  type?: 'submit' | 'button';
  isSubmitting?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}
const Button = ({
  name,
  className,
  type,
  isSubmitting,
  disabled,
  variant = 'primary',
  onClick,
  children,
}: ButtonTypes) => {
  const variants = {
    primary:
      'text-white w-full bg-linear-to-r from-(--primary) to-(--primary-container) py-3 rounded-md hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center gap-2 transition-colors duration-300',
    secondary: 'bg-gray-200 text-black',
    ghost:
      'w-full py-3 rounded-md hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center gap-2 transition-colors duration-300',
  };

  return (
    <button
      type={type ?? 'button'}
      disabled={disabled || isSubmitting}
      onClick={onClick}
      className={`${variants[variant]} ${className ?? ''}`}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Submitting Your Request...</span>
        </div>
      ) : (
        <div className="flex gap-2">
          {children ? children : null}
          {name}
        </div>
      )}
    </button>
  );
};

export default Button;
