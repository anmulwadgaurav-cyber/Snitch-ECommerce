import React from 'react';

const Button = ({ children, type = 'button', variant = 'primary', className = '', fullWidth = false, ...props }) => {
  const baseStyles = "inline-flex justify-center items-center px-6 py-3 text-sm font-medium transition-all focus:outline-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-accent1 hover:bg-brand-accent2 text-white shadow-md shadow-brand-accent1/20",
    outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
