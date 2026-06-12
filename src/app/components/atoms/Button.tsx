'use client';
import { ReactNode } from 'react';

interface ButtonTypes {
  name: string;
  error?: string;
  type?: 'submit';
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
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${variants[variant]} ${className!}`}
    >
      {isSubmitting ? (
        <div className={`${disabled && `bg-(--disabled)`}`}>
          {disabled ? (
            <p>{isSubmitting ? `Submitting Your Request...` : <p>{name}</p>}</p>
          ) : (
            `Submitting Your Request...`
          )}
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
