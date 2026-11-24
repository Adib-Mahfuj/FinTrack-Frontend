import {useEffect} from "react";
import {Link} from "react-router-dom";
import {BarChart3} from "lucide-react";
import {assets} from "../assets/assests.js";
import ProductPreview from "./ProductPreview.jsx";

// Decorative layers of the dark brand panel
const PANEL_GLOW =
    "radial-gradient(60% 50% at 85% 0%, rgba(37,99,235,0.45), transparent 70%), " +
    "radial-gradient(50% 40% at 0% 100%, rgba(37,99,235,0.25), transparent 70%)";
const PANEL_GRID =
    "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)";

// The preview fades out towards the bottom edge
const FADE_MASK = "linear-gradient(to bottom, black 55%, transparent)";

// Split-screen shell shared by the login and signup pages
const AuthLayout = ({pageTitle, title, subtitle, children, footer}) => {
    useEffect(() => {
        document.title = `${pageTitle} · FinTrack`;
    }, [pageTitle]);

    return (
        <div className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
            {/* Brand panel, desktop only */}
            <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
                <div aria-hidden="true" className="absolute inset-0" style={{backgroundImage: PANEL_GLOW}}/>
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{backgroundImage: PANEL_GRID, backgroundSize: "48px 48px", opacity: 0.06}}
                />

                <Link
                    to="/"
                    className="relative flex w-fit items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                        <BarChart3 size={20}/>
                    </span>
                    <span className="text-lg font-semibold tracking-tight">FinTrack</span>
                </Link>

                <div className="relative">
                    <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                        Your money, finally clear.
                    </h2>
                    <p className="mt-4 max-w-md text-lg text-slate-300">
                        Record income and expenses, then see exactly where your money goes each month.
                    </p>

                    <div
                        className="relative mt-10 h-[340px] max-w-md overflow-hidden"
                        style={{maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK}}
                    >
                        <ProductPreview/>
                    </div>
                </div>

                <p className="relative text-sm text-slate-400">Private by design · Works on every device</p>
            </aside>

            {/* Form column */}
            <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10">
                {/* The brand panel is hidden on small screens, so the logo moves here */}
                <Link
                    to="/"
                    aria-label="FinTrack home"
                    className="self-start rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
                >
                    <img src={assets.logo} alt="FinTrack" className="h-10 w-auto"/>
                </Link>

                <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
                    {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}

                    <div className="mt-8">{children}</div>

                    {footer && <p className="mt-6 text-center text-sm text-gray-600">{footer}</p>}
                </main>
            </div>
        </div>
    );
};

export default AuthLayout;