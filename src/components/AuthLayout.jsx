import {useEffect} from "react";
import {Link} from "react-router-dom";
import {Check} from "lucide-react";
import {assets} from "../assets/assests.js";

const HIGHLIGHTS = [
    "Track income and expenses in seconds",
    "See your monthly cash flow at a glance",
    "Export reports to Excel anytime",
];

// Split-screen shell shared by the login and signup pages
const AuthLayout = ({pageTitle, title, subtitle, children, footer}) => {
    useEffect(() => {
        document.title = `${pageTitle} · FinTrack`;
    }, [pageTitle]);

    return (
        <div className="grid min-h-screen bg-white lg:grid-cols-2">
            {/* Brand panel, desktop only */}
            <aside className="relative hidden overflow-hidden bg-blue-600 p-12 text-white lg:flex lg:flex-col lg:justify-center">
                <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10"/>
                <div aria-hidden="true" className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10"/>

                <div className="relative mx-auto max-w-md">
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight">
                        Take control of your money.
                    </h2>
                    <p className="mt-4 text-lg text-blue-100">
                        Record income and expenses, then see exactly where your money goes each month.
                    </p>

                    <ul className="mt-10 space-y-4">
                        {HIGHLIGHTS.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                                    <Check size={14} strokeWidth={3}/>
                                </span>
                                <span className="text-blue-50">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Form column */}
            <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10">
                <Link
                    to="/"
                    aria-label="FinTrack home"
                    className="self-start rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <img src={assets.logo} alt="FinTrack" className="h-10 w-auto"/>
                </Link>

                <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}

                    <div className="mt-8">{children}</div>

                    {footer && <p className="mt-6 text-center text-sm text-gray-600">{footer}</p>}
                </main>
            </div>
        </div>
    );
};

export default AuthLayout;