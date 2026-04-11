import React from 'react';

const CheckboxField = ({ id, label, description, ...props }) => {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex items-center h-5 mt-0.5">
        <input
          id={id}
          type="checkbox"
          className="appearance-none w-5 h-5 border border-brand-secondary/40 bg-white checked:bg-brand-accent1 checked:border-brand-accent1 focus:outline-none flex justify-center items-center cursor-pointer transition-colors
          after:content-[''] after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45 after:opacity-0 checked:after:opacity-100 after:hidden checked:after:block after:-mt-0.5"
          {...props}
        />
      </div>
      <label htmlFor={id} className="flex flex-col cursor-pointer">
        <span className="text-sm font-medium text-brand-primary">{label}</span>
        {description && (
          <span className="text-xs text-brand-secondary mt-0.5">{description}</span>
        )}
      </label>
    </div>
  );
};

export default CheckboxField;
