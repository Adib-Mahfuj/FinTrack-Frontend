// Base surface for every page section; border, radius and padding live here only
export const Card = ({children, className = "", padding = "p-4 sm:p-6", ...rest}) => (
    <div className={`bg-white border border-gray-200 rounded-xl ${padding} ${className}`} {...rest}>
        {children}
    </div>
);

// Section heading with an optional subtitle and action area
export const CardHeader = ({title, subtitle, action}) => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2.5">{action}</div>}
    </div>
);

export default Card;