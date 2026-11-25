import {Check} from "lucide-react";
import ProductPreview from "./ProductPreview.jsx";

const firstAsset = (modules) => Object.values(modules)[0];

// Real screenshots are picked up automatically when they exist in src/assets.
// Without them the panel falls back to the static ProductPreview.
const DESKTOP_SHOT = firstAsset(
    import.meta.glob("../assets/dashboard-desktop.{webp,png,jpg,jpeg}", {eager: true, import: "default"})
);
const MOBILE_SHOT = firstAsset(
    import.meta.glob("../assets/dashboard-mobile.{webp,png,jpg,jpeg}", {eager: true, import: "default"})
);

const POINTS = ["No bank linking", "Excel reports", "Works on mobile"];

// Pale blue field: two soft glows and a fading dot grid
const GLOW =
    "radial-gradient(55% 45% at 90% 0%, rgba(37,99,235,0.10), transparent 70%), " +
    "radial-gradient(45% 40% at 0% 100%, rgba(37,99,235,0.08), transparent 70%)";
const DOTS = "radial-gradient(#bfdbfe 1px, transparent 1px)";
const DOTS_FADE = "linear-gradient(to bottom, black, transparent 70%)";

const BrowserFrame = ({src}) => (
    <div className="overflow-hidden rounded-t-2xl border border-b-0 border-gray-200 bg-white shadow-2xl shadow-blue-900/10">
        <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300"/>
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300"/>
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300"/>
        </div>
        <img src={src} alt="FinTrack dashboard on desktop" className="block h-auto w-full"/>
    </div>
);

// White bezel instead of a dark one keeps the panel light
const PhoneFrame = ({src}) => (
    <div className="absolute bottom-[-72px] right-[5%] w-[168px] overflow-hidden rounded-[2rem] border-[6px] border-white bg-white shadow-2xl shadow-blue-900/20 ring-1 ring-gray-200 xl:w-[196px]">
        <img src={src} alt="FinTrack dashboard on mobile" className="block h-auto w-full"/>
    </div>
);

// Product showcase for the signup page; hidden below the lg breakpoint
const AuthShowcase = ({className = ""}) => (
    <aside className={`relative hidden overflow-hidden border-l border-gray-200 bg-blue-50/50 lg:flex lg:flex-col ${className}`}>
        <div aria-hidden="true" className="absolute inset-0" style={{backgroundImage: GLOW}}/>
        <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
                backgroundImage: DOTS,
                backgroundSize: "22px 22px",
                maskImage: DOTS_FADE,
                WebkitMaskImage: DOTS_FADE,
                opacity: 0.7,
            }}
        />

        <div className="relative px-12 pt-14 xl:px-16 xl:pt-16">
            <h2 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-gray-900 xl:text-5xl">
                See your whole month at a glance.
            </h2>
            <p className="mt-4 max-w-md text-lg text-gray-600">
                Record income and expenses in seconds. FinTrack turns them into clear charts and reports.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {POINTS.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-emerald-600"/>
                        {point}
                    </li>
                ))}
            </ul>
        </div>

        {/* The screenshots bleed off the bottom edge of the panel */}
        <div className="relative mt-10 min-h-[340px] flex-1">
            <div className="absolute left-12 top-0 w-[86%] xl:left-16">
                {DESKTOP_SHOT ? <BrowserFrame src={DESKTOP_SHOT}/> : <ProductPreview/>}
            </div>

            {MOBILE_SHOT && <PhoneFrame src={MOBILE_SHOT}/>}
        </div>
    </aside>
);

export default AuthShowcase;