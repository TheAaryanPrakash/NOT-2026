// Input component

import { ErrorMessage, Field } from "formik";
import React from "react";

const FieldInput = ({
  label,
  id,
  name,
  htmlFor,
  placeholder,
  type = "text",
  widthClassName = "md:w-80 w-full",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${widthClassName}`}>
      <label htmlFor={htmlFor} className="font-medium text-sm text-gray-400">
        {label}*
      </label>
      <div className={`flex flex-col gap-2 relative ${widthClassName}`}>
        <Field
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          className="p-2.5 text-base border border-brandBorder bg-brandBg text-white placeholder-gray-600 rounded-lg transition-colors focus:outline-none focus:border-brandCyan focus:ring-1 focus:ring-brandCyan/50"
          required
          autoComplete="false"
        />
        <ErrorMessage
          name={name}
          component="span"
          data-testid="error-msg"
          className="absolute top-12 left-0 text-red-400 text-sm"
        />
      </div>
    </div>
  );
};

export default FieldInput;
