import {useEffect} from "react";
import {Link} from "react-router-dom";
import {ArrowRight, Check, ChevronDown} from "lucide-react";
import {assets} from "../assets/assests.js";
import Button from "../components/Button.jsx";
import {BENEFITS, FAQ_ITEMS, FEATURES, HERO_POINTS, OWNER, STEPS} from "../util/landingContent.js";

const CONTAINER = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const NAV_LINKS = [
    {label: "Features", href: "#features"},
    {label: "How it works", href: "#how-it-works"},
    {label: "FAQ", href: "#faq"},
];

// Static sample data for the hero preview (not real user data)
const PREVIEW_STATS = [
    {label: "Income", value: "BDT 85,000", tone: "text-emerald-700"},
    {label: "Expenses", value: "BDT 32,400", tone: "text-red-700"},
    {label: "Net savings", value: "BDT 52,600", tone: "text-blue-700"},
];

// [income, expense] bar heights in percent
const PREVIEW_BARS = [
    [0, 18], [62, 0], [0, 0], [48, 12], [0, 34], [0, 0],
    [0, 8], [0, 0], [88, 0], [0, 22], [0, 0], [30, 6],
];

const PREVIEW_ROWS = [
    {title: "Salary", meta: "Salary • 1 Nov", amount: "+BDT 60,000", tone: "bg-emerald-50 text-emerald-700"},
    {title: "House rent", meta: "Rent • 3 Nov", amount: "-BDT 20,000", tone: "bg-red-50 text-red-700"},
    {title: "Groceries", meta: "Groceries • 5 Nov", amount: "-BDT 2,400", tone: "bg-red-50 text-red-700"},
];

const LandingHeader = () => (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className={`${CONTAINER} flex h-16 items-center justify-between gap-4`}>
            <Link to="/" aria-label="FinTrack home" className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <img src={assets.logo} alt="FinTrack" className="h-9 w-auto sm:h-10"/>
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
                {NAV_LINKS.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
                    >
                        {link.label}
                    </a>
                ))}
            </nav>

            <div className="flex items-center gap-2">
                <Button as={Link} to="/login" variant="ghost" size="sm">
                    Log in
                </Button>
                <Button as={Link} to="/signup" size="sm">
                    <span className="sm:hidden">Sign up</span>
                    <span className="hidden sm:inline">Get started</span>
                </Button>
            </div>
        </div>
    </header>
);

// Lightweight, static look-alike of the dashboard (no chart library needed on this page)
const DashboardPreview = () => (
    <div
        role="img"
        aria-label="Preview of the FinTrack dashboard with sample data"
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
    >
        <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300"/>
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300"/>
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300"/>
            <span className="ml-auto text-xs text-gray-500">Sample data</span>
        </div>

        <div className="space-y-5 p-5">
            <div className="grid grid-cols-3 gap-3">
                {PREVIEW_STATS.map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-gray-200 p-3">
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className={`mt-1 text-xs font-semibold sm:text-sm ${stat.tone}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-3 text-xs font-medium text-gray-700">Cash flow</p>
                <div className="flex h-28 items-end gap-1.5">
                    {PREVIEW_BARS.map(([income, expense], index) => (
                        <div key={index} className="flex h-full flex-1 items-end gap-0.5">
                            <div className="w-full rounded-t bg-emerald-500" style={{height: `${income}%`}}/>
                            <div className="w-full rounded-t bg-red-500" style={{height: `${expense}%`}}/>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                {PREVIEW_ROWS.map((row) => (
                    <div key={row.title} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2">
                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-gray-800">{row.title}</p>
                            <p className="truncate text-xs text-gray-500">{row.meta}</p>
                        </div>
                        <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${row.tone}`}>
                            {row.amount}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const Hero = () => (
    <section className="relative isolate overflow-hidden">
        <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl"
        />

        <div className={`${CONTAINER} grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24`}>
            <div>
                <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    Personal finance tracker
                </span>

                <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                    Know exactly where your money goes.
                </h1>
                <p className="mt-5 max-w-xl text-lg text-gray-600">
                    FinTrack is a simple way to record income and expenses, organize them with categories, and see
                    your monthly cash flow at a glance.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button as={Link} to="/signup" size="lg">
                        Get started
                        <ArrowRight size={18}/>
                    </Button>
                    <Button as={Link} to="/login" variant="secondary" size="lg">
                        Log in
                    </Button>
                </div>

                <ul className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
                    {HERO_POINTS.map((point) => (
                        <li key={point} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check size={16} className="text-emerald-600"/>
                            {point}
                        </li>
                    ))}
                </ul>
            </div>

            <DashboardPreview/>
        </div>
    </section>
);

const SectionHeading = ({eyebrow, title, description}) => (
    <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
        {description && <p className="mt-4 text-gray-600">{description}</p>}
    </div>
);

const Features = () => (
    <section id="features" className="scroll-mt-20 border-t border-gray-200 bg-white py-16 sm:py-24">
        <div className={CONTAINER}>
            <SectionHeading
                eyebrow="Features"
                title="Everything you need to stay on top of your money"
                description="Focused tools for tracking, understanding and reporting your finances."
            />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map((feature) => (
                    <div key={feature.title} className="rounded-xl border border-gray-200 p-6">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <feature.icon size={20}/>
                        </span>
                        <h3 className="mt-4 text-base font-semibold text-gray-900">{feature.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section id="how-it-works" className="scroll-mt-20 border-t border-gray-200 py-16 sm:py-24">
        <div className={CONTAINER}>
            <SectionHeading eyebrow="How it works" title="Up and running in three steps"/>

            <ol className="mt-12 grid gap-8 md:grid-cols-3">
                {STEPS.map((step, index) => (
                    <li key={step.title} className="relative">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-base font-semibold text-white">
                            {index + 1}
                        </span>
                        <h3 className="mt-4 text-base font-semibold text-gray-900">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

const Benefits = () => (
    <section className="border-t border-gray-200 bg-white py-16 sm:py-24">
        <div className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-2`}>
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Why FinTrack</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                    Simple on purpose
                </h2>
                <p className="mt-4 max-w-lg text-gray-600">
                    FinTrack does a few things well instead of overwhelming you. You stay in control of what gets
                    recorded, and every screen is built to answer one question: where did my money go?
                </p>
            </div>

            <ul className="space-y-4">
                {BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <Check size={14} strokeWidth={3}/>
                        </span>
                        <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

const Faq = () => (
    <section id="faq" className="scroll-mt-20 border-t border-gray-200 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
            <SectionHeading eyebrow="FAQ" title="Questions, answered"/>

            <div className="mt-10 space-y-3">
                {FAQ_ITEMS.map((item) => (
                    <details key={item.question} className="group rounded-xl border border-gray-200 bg-white px-5 py-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                            {item.question}
                            <ChevronDown
                                size={18}
                                className="shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180"
                            />
                        </summary>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.answer}</p>
                    </details>
                ))}
            </div>
        </div>
    </section>
);

const FinalCta = () => (
    <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-6xl rounded-2xl bg-blue-600 px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ready to take control of your money?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100">
                Create your account and record your first transaction in a minute.
            </p>
            <div className="mt-8 flex justify-center">
                <Button as={Link} to="/signup" variant="secondary" size="lg">
                    Get started
                    <ArrowRight size={18}/>
                </Button>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="border-t border-gray-200 bg-white">
        <div className={`${CONTAINER} flex flex-col items-center justify-between gap-4 py-8 text-sm text-gray-500 sm:flex-row`}>
            <img src={assets.logo} alt="FinTrack" className="h-8 w-auto"/>

            <p className="text-center">
                © {new Date().getFullYear()} FinTrack. Built by {OWNER.name}.
            </p>

            <div className="flex items-center gap-4">
                <a
                    href={OWNER.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:text-gray-900"
                >
                    GitHub
                </a>
                <a
                    href={OWNER.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:text-gray-900"
                >
                    LinkedIn
                </a>
            </div>
        </div>
    </footer>
);

// Public home page shown to visitors who are not signed in
const Landing = () => {
    useEffect(() => {
        document.title = "FinTrack · Personal finance tracker";
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <LandingHeader/>
            <main>
                <Hero/>
                <Features/>
                <HowItWorks/>
                <Benefits/>
                <Faq/>
                <FinalCta/>
            </main>
            <Footer/>
        </div>
    );
};

export default Landing;