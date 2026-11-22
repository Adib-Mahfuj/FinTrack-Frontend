import {LoaderCircle} from "lucide-react";

const VARIANTS = {
    primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-blue-500",
    danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500",
    ghost: "text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-blue-500",
};

const SIZES = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
};

// Shared button; `as` lets it render a router <Link> with the same look
const Button = ({
                    as: Component = "button",
                    variant = "primary",
                    size = "md",
                    icon: Icon,
                    loading = false,
                    loadingText,
                    disabled = false,
                    className = "",
                    type = "button",
                    children,
                    ...rest
                }) => {
    // Native button attributes only apply when rendering a real <button>
    const nativeProps = Component === "button" ? {type, disabled: disabled || loading} : {};

    return (
        <Component
            {...nativeProps}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium
                        transition-colors duration-200 cursor-pointer focus:outline-none
                        focus-visible:ring-2 focus-visible:ring-offset-2
                        disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none
                        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
            {...rest}
        >
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin"/> : Icon && <Icon size={16}/>}
            {loading && loadingText ? loadingText : children}
        </Component>
    );
};

export default Button;