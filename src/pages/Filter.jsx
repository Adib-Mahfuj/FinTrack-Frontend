import Dashboard from "../components/Dashboard.jsx";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {addThousandsSeparator} from "../util/util.js";
import moment from "moment";
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Inbox,
    LoaderCircle,
    RefreshCw,
    RotateCcw,
    Search,
    SearchX,
    X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Constants                                                            */
/* ------------------------------------------------------------------ */

const DATE_FORMAT = "YYYY-MM-DD";
const PAGE_SIZE = 20; // set to 6 to test pagination with a few records
const DEBOUNCE_MS = 400;
const TYPES = ["income", "expense"];

// value = "<sortField>-<sortOrder>", split before sending to the backend
const SORT_OPTIONS = [
    {value: "date-desc", label: "Newest first"},
    {value: "date-asc", label: "Oldest first"},
    {value: "amount-desc", label: "Amount: high to low"},
    {value: "amount-asc", label: "Amount: low to high"},
    {value: "name-asc", label: "Name: A to Z"},
    {value: "name-desc", label: "Name: Z to A"},
];

const DEFAULT_FILTERS = {
    type: "income",
    startDate: "",
    endDate: "",
    sort: "date-desc",
};

const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 " +
    "outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5";

const secondaryBtnClass =
    "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium " +
    "text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 " +
    "focus:outline-none focus:ring-2 focus:ring-slate-200 active:scale-95 " +
    "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const isValidDate = (value) => Boolean(value) && moment(value, DATE_FORMAT, true).isValid();

const formatDate = (value) => moment(value, DATE_FORMAT).format("DD MMM YYYY");

const readKeyword = (params) => (params.get("q") || "").trim().slice(0, 100);

// Reads and validates filters from the URL so a bad/handmade URL can never break the page
const readFiltersFromUrl = (params) => {
    const type = params.get("type");
    const sort = params.get("sort");
    let startDate = isValidDate(params.get("from")) ? params.get("from") : "";
    let endDate = isValidDate(params.get("to")) ? params.get("to") : "";

    if (startDate && endDate && startDate > endDate) {
        startDate = "";
        endDate = "";
    }

    return {
        type: TYPES.includes(type) ? type : DEFAULT_FILTERS.type,
        startDate,
        endDate,
        sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : DEFAULT_FILTERS.sort,
    };
};

const getPresets = () => {
    const now = moment();
    const fmt = (m) => m.format(DATE_FORMAT);
    const lastMonth = now.clone().subtract(1, "month");

    return [
        {key: "all", label: "All time", start: "", end: ""},
        {key: "month", label: "This month", start: fmt(now.clone().startOf("month")), end: fmt(now)},
        {
            key: "lastMonth",
            label: "Last month",
            start: fmt(lastMonth.clone().startOf("month")),
            end: fmt(lastMonth.clone().endOf("month")),
        },
        {key: "30d", label: "Last 30 days", start: fmt(now.clone().subtract(29, "days")), end: fmt(now)},
        {key: "year", label: "This year", start: fmt(now.clone().startOf("year")), end: fmt(now)},
    ];
};

/* ------------------------------------------------------------------ */
/* Small presentational components                                      */
/* ------------------------------------------------------------------ */

const FilterChip = ({label, onRemove}) => (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        {label}
        <button
            type="button"
            onClick={onRemove}
            className="-mr-1 rounded-full p-0.5 text-blue-400 transition hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
            aria-label={`Remove filter ${label}`}
        >
            <X size={12}/>
        </button>
    </span>
);

const ResultsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="mt-2 flex animate-pulse items-center gap-4 p-3">
                <div className="h-12 w-12 rounded-full bg-slate-100"/>
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-slate-100"/>
                    <div className="h-3 w-1/5 rounded bg-slate-100"/>
                </div>
                <div className="h-8 w-24 rounded-md bg-slate-100"/>
            </div>
        ))}
    </div>
);

const StateMessage = ({icon: Icon, tone = "slate", title, description, children}) => {
    const toneClass = tone === "red" ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-400";
    return (
        <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${toneClass}`}>
                <Icon size={24}/>
            </div>
            <p className="text-sm font-medium text-slate-700">{title}</p>
            <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>
            {children}
        </div>
    );
};

const Pagination = ({page, totalPages, total, onChange}) => {
    const from = (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, total);

    return (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
            <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{from}–{to}</span> of{" "}
                <span className="font-medium text-slate-700">{total}</span>
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    className={secondaryBtnClass}
                >
                    <ChevronLeft size={16}/>
                    Previous
                </button>
                <span className="px-2 text-sm text-slate-500">
                    Page {page} of {totalPages}
                </span>
                <button
                    type="button"
                    onClick={() => onChange(page + 1)}
                    disabled={page === totalPages}
                    className={secondaryBtnClass}
                >
                    Next
                    <ChevronRight size={16}/>
                </button>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const Filter = () => {
    useUser();

    const [searchParams, setSearchParams] = useSearchParams();

    // Filters (initialised from the URL)
    const [filters, setFilters] = useState(() => readFiltersFromUrl(searchParams));
    const [keyword, setKeyword] = useState(() => readKeyword(searchParams)); // what the user types
    const [debouncedKeyword, setDebouncedKeyword] = useState(() => readKeyword(searchParams)); // what is sent

    // Data
    const [transactions, setTransactions] = useState([]);
    const [resultType, setResultType] = useState(filters.type); // type of the data currently on screen
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [error, setError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [page, setPage] = useState(1);

    const resultsRef = useRef(null);

    const today = moment().format(DATE_FORMAT); // local date, not UTC

    const updateFilter = (patch) => setFilters((prev) => ({...prev, ...patch}));

    const rangeInvalid = Boolean(filters.startDate && filters.endDate && filters.startDate > filters.endDate);
    const hasActiveFilters = Boolean(filters.startDate || filters.endDate || debouncedKeyword);

    const presets = getPresets();
    const activePreset = presets.find(
        (p) => p.start === filters.startDate && p.end === filters.endDate
    )?.key;

    /* ---------- Debounce the search keyword ---------- */
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedKeyword(keyword.trim()), DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [keyword]);

    /* ---------- Mirror filters into the URL (only non-default values) ---------- */
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.type !== DEFAULT_FILTERS.type) params.set("type", filters.type);
        if (filters.startDate) params.set("from", filters.startDate);
        if (filters.endDate) params.set("to", filters.endDate);
        if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
        if (debouncedKeyword) params.set("q", debouncedKeyword);

        if (params.toString() !== searchParams.toString()) {
            setSearchParams(params, {replace: true});
        }
    }, [filters, debouncedKeyword, searchParams, setSearchParams]);

    /* ---------- Fetch whenever a filter changes ---------- */
    useEffect(() => {
        if (rangeInvalid) {
            setLoading(false); // an earlier request may have just been cancelled
            return;
        }

        const controller = new AbortController();
        const [sortField, sortOrder] = filters.sort.split("-");

        const fetchTransactions = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await axiosConfig.post(
                    API_ENDPOINTS.APPLY_FILTERS,
                    {
                        type: filters.type,
                        startDate: filters.startDate || null, // "" would fail LocalDate parsing
                        endDate: filters.endDate || null,
                        keyword: debouncedKeyword,
                        sortField,
                        sortOrder,
                    },
                    {signal: controller.signal}
                );
                if (response.status === 200) {
                    setTransactions(Array.isArray(response.data) ? response.data : []);
                    setResultType(filters.type);
                    setPage(1);
                }
            } catch (err) {
                if (axios.isCancel(err)) return; // a newer request replaced this one
                console.error("Failed to filter transactions", err);
                setError(true);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                    setInitialLoad(false);
                }
            }
        };

        fetchTransactions();

        return () => controller.abort();
    }, [
        filters.type,
        filters.startDate,
        filters.endDate,
        filters.sort,
        debouncedKeyword,
        rangeInvalid,
        reloadKey,
    ]);

    /* ---------- Actions ---------- */
    const clearKeyword = () => {
        setKeyword("");
        setDebouncedKeyword("");
    };

    const clearDates = () => updateFilter({startDate: "", endDate: ""});

    // Clears only the narrowing filters. Type and sort are view settings, so they stay.
    const clearAll = () => {
        clearKeyword();
        clearDates();
    };

    const handlePageChange = (next) => {
        setPage(next);
        resultsRef.current?.scrollIntoView({behavior: "smooth", block: "start"});
    };

    /* ---------- Derived data ---------- */
    const totalAmount = useMemo(
        () => transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0),
        [transactions]
    );

    const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = transactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const dateChipLabel = () => {
        if (filters.startDate && filters.endDate) {
            return `${formatDate(filters.startDate)} – ${formatDate(filters.endDate)}`;
        }
        if (filters.startDate) return `From ${formatDate(filters.startDate)}`;
        return `Until ${formatDate(filters.endDate)}`;
    };

    const chips = [
        (filters.startDate || filters.endDate) && {
            key: "date",
            label: dateChipLabel(),
            onRemove: clearDates,
        },
        debouncedKeyword && {
            key: "keyword",
            label: `“${debouncedKeyword}”`,
            onRemove: clearKeyword,
        },
    ].filter(Boolean);

    const isIncome = resultType === "income";
    const showSkeleton = initialLoad || (loading && transactions.length === 0);
    const showSummary = !initialLoad && !error;

    return (
        <Dashboard activeMenu="Filter">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">

                    {/* ---------- Filter card ---------- */}
                    <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="mb-6">
                            <h5 className="text-xl font-semibold text-slate-800 tracking-tight">
                                Filter Transactions
                            </h5>
                            <p className="mt-1 text-xs text-slate-400">
                                Search and filter your income and expenses by name, date range or amount.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="mb-4">
                            <label className={labelClass} htmlFor="keyword">Search</label>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                <input
                                    id="keyword"
                                    type="text"
                                    value={keyword}
                                    maxLength={100}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Escape" && clearKeyword()}
                                    placeholder="Search by name..."
                                    className={`${inputClass} pl-9 pr-9`}
                                />
                                {keyword && (
                                    <button
                                        type="button"
                                        onClick={clearKeyword}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                                        aria-label="Clear search"
                                    >
                                        <X size={14}/>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Type toggle */}
                            <div>
                                <span className={labelClass}>Type</span>
                                <div role="group" aria-label="Transaction type" className="flex rounded-lg bg-slate-100 p-1">
                                    {TYPES.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            aria-pressed={filters.type === t}
                                            onClick={() => updateFilter({type: t})}
                                            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition cursor-pointer ${
                                                filters.type === t
                                                    ? "bg-white text-slate-900 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-700"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="startDate">Start Date</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={filters.startDate}
                                    max={filters.endDate || today}
                                    aria-invalid={rangeInvalid}
                                    onChange={(e) => updateFilter({startDate: e.target.value})}
                                    className={`${inputClass} ${rangeInvalid ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                                />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="endDate">End Date</label>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={filters.endDate}
                                    min={filters.startDate || undefined}
                                    max={today}
                                    aria-invalid={rangeInvalid}
                                    onChange={(e) => updateFilter({endDate: e.target.value})}
                                    className={`${inputClass} ${rangeInvalid ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                                />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="sort">Sort By</label>
                                <select
                                    id="sort"
                                    value={filters.sort}
                                    onChange={(e) => updateFilter({sort: e.target.value})}
                                    className={inputClass}
                                >
                                    {SORT_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Quick ranges */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Quick range
                            </span>
                            {presets.map((p) => (
                                <button
                                    key={p.key}
                                    type="button"
                                    aria-pressed={activePreset === p.key}
                                    onClick={() => updateFilter({startDate: p.start, endDate: p.end})}
                                    className={`rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer ${
                                        activePreset === p.key
                                            ? "border-blue-200 bg-blue-50 text-blue-700"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {rangeInvalid && (
                            <p className="mt-3 text-sm text-red-600" role="alert">
                                Start date cannot be after end date.
                            </p>
                        )}
                    </div>

                    {/* ---------- Results card ---------- */}
                    <div ref={resultsRef} className="scroll-mt-6 p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <h5 className="text-xl font-semibold text-slate-800 tracking-tight">Results</h5>

                                {showSummary && (
                                    <span
                                        aria-live="polite"
                                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                                    >
                                        {transactions.length} {transactions.length === 1 ? "transaction" : "transactions"}
                                    </span>
                                )}

                                {loading && !initialLoad && (
                                    <LoaderCircle
                                        className="h-4 w-4 animate-spin text-slate-400"
                                        aria-label="Updating results"
                                    />
                                )}
                            </div>

                            {showSummary && transactions.length > 0 && (
                                <div
                                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold ${
                                        isIncome ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                                    }`}
                                >
                                    <span className="font-medium text-gray-500">Total</span>
                                    <span>BDT {addThousandsSeparator(totalAmount)}</span>
                                </div>
                            )}
                        </div>

                        {/* Active filter chips + Clear all */}
                        {chips.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                {chips.map((chip) => (
                                    <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove}/>
                                ))}

                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="group ml-1 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 underline-offset-2 transition hover:bg-slate-100 hover:text-slate-900 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
                                >
                                    <RotateCcw
                                        size={12}
                                        className="transition-transform duration-300 group-hover:-rotate-180"
                                    />
                                    Clear all
                                </button>
                            </div>
                        )}

                        <div className="mt-2" aria-busy={loading}>
                            {showSkeleton ? (
                                <ResultsSkeleton/>
                            ) : error ? (
                                <StateMessage
                                    icon={AlertCircle}
                                    tone="red"
                                    title="Could not load transactions"
                                    description="Check your connection and try again."
                                >
                                    <button
                                        type="button"
                                        onClick={() => setReloadKey((k) => k + 1)}
                                        className={`${secondaryBtnClass} mt-4`}
                                    >
                                        <RefreshCw size={16} className="text-slate-400"/>
                                        Try again
                                    </button>
                                </StateMessage>
                            ) : transactions.length === 0 ? (
                                hasActiveFilters ? (
                                    <StateMessage
                                        icon={SearchX}
                                        title="No matching transactions"
                                        description="Try a different date range or keyword."
                                    >
                                        <button type="button" onClick={clearAll} className={`${secondaryBtnClass} mt-4`}>
                                            <RotateCcw size={16} className="text-slate-400"/>
                                            Clear filters
                                        </button>
                                    </StateMessage>
                                ) : (
                                    <StateMessage
                                        icon={Inbox}
                                        title={`No ${resultType} yet`}
                                        description={`Your ${resultType} transactions will appear here once you add them.`}
                                    />
                                )
                            ) : (
                                <>
                                    <div
                                        className={`grid grid-cols-1 md:grid-cols-2 transition-opacity duration-200 ${
                                            loading ? "opacity-50" : "opacity-100"
                                        }`}
                                    >
                                        {pageItems.map((t) => (
                                            <TransactionInfoCard
                                                key={`${resultType}-${t.id}`}
                                                title={t.name}
                                                icon={t.icon}
                                                date={moment(t.date).format("DD-MM-YYYY")}
                                                amount={t.amount}
                                                type={resultType}
                                                hideDeleteBtn
                                            />
                                        ))}
                                    </div>

                                    {transactions.length > PAGE_SIZE && (
                                        <Pagination
                                            page={currentPage}
                                            totalPages={totalPages}
                                            total={transactions.length}
                                            onChange={handlePageChange}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </Dashboard>
    );
};

export default Filter;