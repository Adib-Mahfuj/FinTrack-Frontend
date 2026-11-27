import {useEffect} from "react";
import {Link} from "react-router-dom";
import {assets} from "../assets/assests.js";
import AuthShowcase from "./AuthShowcase.jsx";

// One soft blue gradient shared by every auth page: almost white at the top left,
// a clearer sky blue at the bottom right
const AUTH_BG = {
    backgroundImage: "linear-gradient(135deg, #f7fbff 0%, #e8f1ff 55%, #dbe9ff 100%)",
};

const LOGO_LINK =
    "rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

// Logo sits above the heading on every auth page
const Logo = () => (
    <Link to="/" aria-label="FinTrack home" className={`inline-flex ${LOGO_LINK}`}>
        <img src={assets.logo} alt="FinTrack" className="h-9 w-auto"/>
    </Link>
);

const Heading = ({title, subtitle, hideSubtitleWhenShort = false}) => (
    <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[1.75rem]">{title}</h1>
        {subtitle && (
            <p className={`mt-1.5 text-sm text-gray-500 ${hideSubtitleWhenShort ? "hide-when-short" : ""}`}>
                {subtitle}
            </p>
        )}
    </div>
);

// Login: logo above a white card that holds only the login form
const CardLayout = ({title, subtitle, children, footer}) => (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10" style={AUTH_BG}>
        <Logo/>

        <main className="animate-fade-up mt-6 w-full max-w-[440px] rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-8">
            <Heading title={title} subtitle={subtitle}/>
            <div className="mt-7">{children}</div>

            {footer && (
                <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-600">{footer}</p>
            )}
        </main>
    </div>
);

// Signup: form on the left, product details on the right, one continuous background.
// On desktop it fills exactly one screen, so the page itself never scrolls.
const SplitLayout = ({title, subtitle, children, footer}) => (
    <div className="min-h-screen overflow-hidden lg:h-screen" style={AUTH_BG}>
        <div className="grid min-h-screen lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Auto margins centre the form; the column only scrolls as a safety net (e.g. many error messages) */}
            <div className="flex min-h-screen flex-col overflow-y-auto px-5 py-8 sm:px-10 lg:h-full lg:min-h-0 lg:px-14 lg:py-6">
                <main className="animate-fade-up m-auto w-full max-w-[400px]">
                    <div className="flex justify-center">
                        <Logo/>
                    </div>

                    <div className="mt-4">
                        <Heading title={title} subtitle={subtitle} hideSubtitleWhenShort/>
                    </div>

                    <div className="mt-5">{children}</div>

                    {footer && <p className="mt-4 text-center text-sm text-gray-600">{footer}</p>}
                </main>
            </div>

            <AuthShowcase className="lg:h-full"/>
        </div>
    </div>
);

// Variant "card" (login, default) or "split" (signup)
const AuthLayout = ({variant = "card", pageTitle, ...layoutProps}) => {
    useEffect(() => {
        document.title = `${pageTitle} · FinTrack`;
    }, [pageTitle]);

    const Layout = variant === "split" ? SplitLayout : CardLayout;

    return <Layout {...layoutProps}/>;
};

export default AuthLayout;