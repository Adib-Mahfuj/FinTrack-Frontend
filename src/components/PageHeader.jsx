// Page-level title block with an optional primary action area
const PageHeader = ({title, subtitle, actions}) => (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
);

export default PageHeader;