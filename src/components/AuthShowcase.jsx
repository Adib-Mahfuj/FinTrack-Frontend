import {Check, Minus, Plus} from "lucide-react";
import ProductPreview from "./ProductPreview.jsx";

const POINTS = ["No bank linking", "Excel reports", "Works on mobile"];

// Decorative layers of the dark panel
const GLOW =
    "radial-gradient(60% 50% at 85% 0%, rgba(37,99,235,0.45), transparent 70%), " +
    "radial-gradient(50% 45% at 0% 100%, rgba(37,99,235,0.28), transparent 70%)";
const GRID =
    "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)";

// The preview fades out towards the bottom edge
const FADE = "linear-gradient(to bottom, black 60%, transparent)";

// A slight 3D tilt gives the preview depth
const TILT = "perspective(1600px) rotateY(-9deg) rotateX(4deg)";

// Matches the sample numbers in ProductPreview (52,600 saved of 85,000 income)
const SAMPLE_SAVINGS_PERCENT = 62;

// Glass card that floats above the preview (sample data only)
const FloatingChip = ({className = "", delay = "0s", children}) => (
    <div
        className={`animate-float absolute flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-md ${className}`}
        style={{animationDelay: delay}}
    >
        {children}
    </div>
);

const SavingsRing = ({percent}) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;

    return (
        <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90" aria-hidden="true">
            <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="4"/>
            <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="#34d399"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - percent / 100)}
            />
        </svg>
    );
};

// Marketing panel for the signup page; hidden below the lg breakpoint
const AuthShowcase = ({className = ""}) => (
    <aside className={`relative hidden overflow-hidden bg-slate-950 text-white lg:flex lg:flex-col ${className}`}>
        <div aria-hidden="true" className="absolute inset-0" style={{backgroundImage: GLOW}}/>
        <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{backgroundImage: GRID, backgroundSize: "48px 48px", opacity: 0.06}}
        />

        {/* Headline */}
        <div className="relative px-12 pt-14 xl:px-16 xl:pt-20">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
                Personal finance tracker
            </span>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight xl:text-5xl">
                See your whole month at a glance.
            </h2>
            <p className="mt-4 max-w-md text-lg text-slate-300">
                Record income and expenses in seconds. FinTrack turns them into clear charts and reports.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {POINTS.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-emerald-400"/>
                        {point}
                    </li>
                ))}
            </ul>
        </div>

        {/* Preview with floating chips */}
        <div
            className="relative mt-10 min-h-[380px] flex-1"
            style={{maskImage: FADE, WebkitMaskImage: FADE}}
        >
            <div
                className="absolute left-[16%] top-0 w-[78%] max-w-[760px] origin-left"
                style={{transform: TILT}}
            >
                <ProductPreview/>
            </div>

            <FloatingChip className="left-[2%] top-[8%]" delay="0s">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Plus size={18}/>
                </span>
                <span>
                    <span className="block text-xs text-slate-300">Salary</span>
                    <span className="block text-sm font-semibold text-emerald-300">+BDT 60,000</span>
                </span>
            </FloatingChip>

            <FloatingChip className="right-[3%] top-[26%]" delay="1.5s">
                <SavingsRing percent={SAMPLE_SAVINGS_PERCENT}/>
                <span>
                    <span className="block text-xs text-slate-300">Net savings</span>
                    <span className="block text-sm font-semibold text-white">{SAMPLE_SAVINGS_PERCENT}% of income</span>
                </span>
            </FloatingChip>

            <FloatingChip className="left-[7%] top-[52%]" delay="3s">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20 text-red-300">
                    <Minus size={18}/>
                </span>
                <span>
                    <span className="block text-xs text-slate-300">Groceries</span>
                    <span className="block text-sm font-semibold text-red-300">-BDT 2,400</span>
                </span>
            </FloatingChip>
        </div>
    </aside>
);

export default AuthShowcase;