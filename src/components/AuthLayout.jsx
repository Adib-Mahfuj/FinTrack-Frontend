import {useEffect} from "react";
import {Link} from "react-router-dom";
import {assets} from "../assets/assests.js";
import AuthShowcase from "./AuthShowcase.jsx";

// Soft backdrop of the centered (login) layout
const BACKDROP = "radial-gradient(60% 40% at 50% 0%, rgba(37,99,235,0.12), transparent 70%)";
const DOTS = "radial-gradient(#cbd5e1 1px, transparent 1px)";
const DOTS_FADE = "radial-gradient(ellipse at center, black 30%, transparent 75%)";

const LOGO_LINK =
    "rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

// Login: a minimal centered card, nothing but the form
const CardLayout = ({title, subtitle, children, footer}) => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 px-5 py-10">
        <div aria-hidden="true" className="absolute inset-0" style={{backgroundImage: BACKDROP}}/>
        <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
                backgroundImage: DOTS,
                backgroundSize: "22px 22px",
                maskImage: DOTS_FADE,
                WebkitMaskImage: DOTS_FADE,
                opacity: 0.6,
            }}
        />

        <Link to="/" aria-label="FinTrack home" className={`relative ${LOGO_LINK}`}>
            <img src={assets.logo} alt="FinTrack" className="h-11 w-auto"/>
        </Link>

        <main className="animate-fade-up relative mt-8 w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}

            <div className="mt-8">{children}</div>

            {footer && (
                <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-600">{footer}</p>
            )}
        </main>

        <p className="relative mt-6 text-xs text-gray-500">
            Private by design · © {new Date().getFullYear()} FinTrack
        </p>
    </div>
);

// Signup: form on the left (about 42%), product showcase on the right (about 58%)
const SplitLayout = ({title, subtitle, children, footer}) => (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14">
            <Link to="/" aria-label="FinTrack home" className={`self-start ${LOGO_LINK}`}>
                <img src={assets.logo} alt="FinTrack" className="h-10 w-auto"/>
            </Link>

            <main className="animate-fade-up mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
                {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}

                <div className="mt-8">{children}</div>

                {footer && <p className="mt-6 text-center text-sm text-gray-600">{footer}</p>}
            </main>
        </div>

        {/* Stays in view while a long form scrolls */}
        <AuthShowcase className="lg:sticky lg:top-0 lg:h-screen"/>
    </div>
);

// Shared shell of the auth pages: variant "card" (default) or "split"
const AuthLayout = ({variant = "card", pageTitle, ...layoutProps}) => {
    useEffect(() => {
        document.title = `${pageTitle} · FinTrack`;
    }, [pageTitle]);

    const Layout = variant === "split" ? SplitLayout : CardLayout;

    return <Layout {...layoutProps}/>;
};

export default AuthLayout;