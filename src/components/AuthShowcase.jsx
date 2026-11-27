import {Check} from "lucide-react";
import ProductPreview from "./ProductPreview.jsx";

const firstAsset = (modules) => Object.values(modules)[0];

// Real screenshots are picked up automatically when they exist in src/assets
const DESKTOP_SHOT = firstAsset(
    import.meta.glob("../assets/dashboard-desktop.{webp,png,jpg,jpeg}", {eager: true, import: "default"})
);
const MOBILE_SHOT = firstAsset(
    import.meta.glob("../assets/dashboard-mobile.{webp,png,jpg,jpeg}", {eager: true, import: "default"})
);

const POINTS = ["No bank linking", "Excel reports", "Works on mobile"];

// Full dark bezel on all four sides. If the panel is short, the screenshot inside is cropped
// at the bottom while the frame itself stays complete.
const LaptopFrame = ({src}) => (
    <div className="absolute left-[5%] top-0 flex max-h-full w-[84%] flex-col overflow-hidden rounded-2xl border-[6px] border-neutral-800 bg-white shadow-2xl shadow-blue-900/15">
        <img
            src={src}
            alt="FinTrack dashboard on desktop"
            className="block min-h-0 w-full object-cover object-top"
        />
    </div>
);

// The mobile image already contains its own phone frame. It is sized by height so the whole
// phone is always visible, and it overlaps the right edge of the laptop like a real device shot.
const PhoneShot = ({src}) => (
    <img
        src={src}
        alt="FinTrack dashboard on mobile"
        className="absolute -bottom-3 right-[3%] h-[88%] w-auto drop-shadow-2xl"
    />
);

// Product details for the signup page; no background or border of its own
const AuthShowcase = ({className = ""}) => (
    <aside className={`relative hidden overflow-hidden lg:flex lg:flex-col ${className}`}>
        {/* Left padding matches the laptop frame (5%), so text and screenshot share one edge */}
        <div className="pl-[5%] pr-[8%] pt-12 xl:pt-14">
            <h2 className="max-w-xl text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-gray-900 xl:text-4xl">
                See your whole month at a glance.
            </h2>
            <p className="mt-3 max-w-md text-base text-gray-600 xl:text-lg">
                Record income and expenses in seconds. FinTrack turns them into clear charts and reports.
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {POINTS.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-emerald-600"/>
                        {point}
                    </li>
                ))}
            </ul>
        </div>

        {/* Everything below sits inside the panel, nothing bleeds off the bottom */}
        <div className="relative mb-8 mt-8 min-h-0 flex-1">
            {DESKTOP_SHOT ? (
                <LaptopFrame src={DESKTOP_SHOT}/>
            ) : (
                <div className="absolute left-[5%] top-0 w-[84%]">
                    <ProductPreview/>
                </div>
            )}

            {MOBILE_SHOT && <PhoneShot src={MOBILE_SHOT}/>}
        </div>
    </aside>
);

export default AuthShowcase;