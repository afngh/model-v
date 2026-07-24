import React from 'react';

/**
 * Plain HTML-style button control (scientific textbook / matplotlib aesthetic).
 */
const Button = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium border text-xs tracking-tight rounded-sm transition-colors focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3.5 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2'
  };

  const variantStyles = {
    primary: 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800',
    secondary: 'bg-white text-slate-900 border-slate-900 hover:bg-slate-100',
    danger: 'bg-white text-red-600 border-red-600 hover:bg-red-50',
    outline: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.secondary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
