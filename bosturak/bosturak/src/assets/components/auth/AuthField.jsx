import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function AuthField({
  label,
  name,
  error,
  type = "text",
  ...inputProps
}) {
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";
  const inputId = `auth-${name}`;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          {...inputProps}
          id={inputId}
          name={name}
          type={isPassword && visible ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-2xl border bg-gray-50
            px-5 py-3.5 text-gray-900 outline-none
            transition-colors focus:ring-4
            ${isPassword ? "pr-14" : ""}
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:border-green-500 focus:ring-green-100"
            }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={`${label}: ${
              visible ? "жасыру" : "көрсету"
            }`}
            aria-controls={inputId}
            className="absolute right-2 top-1/2 flex h-10 w-10
              -translate-y-1/2 items-center justify-center
              rounded-xl text-gray-500 transition-colors
              hover:bg-gray-200 hover:text-gray-900
              focus-visible:outline-2
              focus-visible:outline-green-600"
          >
            {visible ? (
              <EyeOff size={19} aria-hidden="true" />
            ) : (
              <Eye size={19} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthField;