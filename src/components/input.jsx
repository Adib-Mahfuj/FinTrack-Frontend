import {useId, useState} from "react";
import {Eye, EyeOff} from "lucide-react";

// 16px on phones stops iOS Safari from zooming in on focus; 14px from the sm breakpoint up
const FIELD_BASE =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm shadow-slate-900/5 " +
    "placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-[3px] sm:text-sm " +
    "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

const FIELD_OK = "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-500/15";
const FIELD_ERROR = "border-red-400 focus:border-red-500 focus:ring-red-500/15";

const Input = ({
                   label,
                   value,
                   onChange,
                   placeholder,
                   type = "text",
                   isSelect = false,
                   options = [],
                   prefix,
                   error,
                   helperText,
                   id,
                   ...rest
               }) => {
    const generatedId = useId();
    const fieldId = id || generatedId;
    const messageId = `${fieldId}-message`;
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const message = error || helperText;
    const fieldClass = `${FIELD_BASE} ${error ? FIELD_ERROR : FIELD_OK}`;

    const sharedProps = {
        id: fieldId,
        value,
        onChange,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": message ? messageId : undefined,
        ...rest,
    };

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            <div className="relative">
                {isSelect ? (
                    <select className={fieldClass} {...sharedProps}>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <>
                        {/* Leading adornment such as a currency code */}
                        {prefix && (
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-base font-medium text-slate-500 sm:text-sm">
                                {prefix}
                            </span>
                        )}
                        <input
                            className={`${fieldClass} ${isPassword ? "pr-10" : ""} ${prefix ? "pl-14" : ""}`}
                            type={isPassword ? (showPassword ? "text" : "password") : type}
                            placeholder={placeholder}
                            {...sharedProps}
                        />
                    </>
                )}

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-0.5
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                        {showPassword ? (
                            <Eye size={20} className="text-slate-700 transition-colors hover:text-slate-900"/>
                        ) : (
                            <EyeOff size={20} className="text-slate-500 transition-colors hover:text-slate-700"/>
                        )}
                    </button>
                )}
            </div>

            {message && (
                <p
                    id={messageId}
                    role={error ? "alert" : undefined}
                    className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Input;