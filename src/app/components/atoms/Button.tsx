'use client';

interface ButtonTypes {
  name: string;
  error?: string;
  type?: 'submit';
  isSubmitting?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}
const Button = ({
  name,
  className,
  type,
  isSubmitting,
  disabled,
  variant = 'primary',
}: ButtonTypes) => {
  const variants = {
    primary:
      'text-white w-full bg-linear-to-r from-(--primary) to-(--primary-container) py-3 rounded-md hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center gap-2 transition-colors duration-300',
    secondary: 'bg-gray-200 text-black',
    danger: 'bg-red-500 text-white',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${variants[variant]} ${className}`}
    >
      {isSubmitting ? (
        <div className={`${disabled && `bg-(--disabled)`}`}>
          {disabled ? (
            <p>{isSubmitting ? `Submitting Your Request...` : <p>{name}</p>}</p>
          ) : (
            ` Submitting Your Request...`
          )}
        </div>
      ) : (
        <div>{name}</div>
      )}
    </button>
  );
};

export default Button;
