import React, { useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';

const InputField = ({ label, id, type = 'text', icon: Icon, placeholder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-brand-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <span className="absolute left-3 text-brand-secondary">
            <Icon size={20} />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={`w-full bg-white border border-brand-secondary/30 text-brand-primary placeholder:text-brand-secondary text-sm p-3 focus:outline-none focus:border-brand-accent1 focus:ring-1 focus:ring-brand-accent1 transition-colors ${
            Icon ? 'pl-10' : 'pl-3'
          } ${isPassword ? 'pr-10' : 'pr-3'}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-brand-secondary hover:text-brand-primary focus:outline-none transition-colors"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
