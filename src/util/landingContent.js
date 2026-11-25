import {FileSpreadsheet, LayoutDashboard, ShieldCheck, SlidersHorizontal, Tags, Wallet} from "lucide-react";

// Footer credit; remove or edit freely
export const OWNER = {
    name: "Adib Mahfuj",
    github: "https://github.com/Adib-Mahfuj",
    linkedin: "https://www.linkedin.com/in/adibmahfuj",
};

export const HERO_POINTS = [
    "No bank linking required",
    "Works on desktop and mobile",
    "Export reports to Excel",
];

// Only describe features that exist in the app
export const FEATURES = [
    {
        icon: Wallet,
        title: "Income & expense tracking",
        description: "Record every transaction with a category, date and icon, and review or delete entries whenever you need.",
    },
    {
        icon: Tags,
        title: "Custom categories",
        description: "Create income and expense categories with emoji icons that match how you actually spend.",
    },
    {
        icon: LayoutDashboard,
        title: "Monthly dashboard",
        description: "See cash flow, spending by category and how this month compares with the last, all on one screen.",
    },
    {
        icon: SlidersHorizontal,
        title: "Search and filters",
        description: "Find any transaction by name, date range or type, then sort by date, amount or name.",
    },
    {
        icon: FileSpreadsheet,
        title: "Excel reports",
        description: "Download your monthly income or expenses as an Excel file, or have it emailed to you.",
    },
    {
        icon: ShieldCheck,
        title: "Secure accounts",
        description: "Your account is password-protected, and every user only ever sees their own data.",
    },
];

export const STEPS = [
    {
        title: "Create your account",
        description: "Sign up with your email and confirm it using the activation link we send you.",
    },
    {
        title: "Add your transactions",
        description: "Set up a few categories, then record income and expenses as they happen.",
    },
    {
        title: "Review your month",
        description: "Open the dashboard to see where your money goes and how your savings are trending.",
    },
];

export const BENEFITS = [
    "Manual entry keeps you aware of every taka you spend.",
    "A clean monthly view instead of dozens of confusing charts.",
    "No bank connection or card details needed.",
    "Fast on any device, from phone to desktop.",
];

export const FAQ_ITEMS = [
    {
        question: "Do I need to connect my bank account?",
        answer: "No. FinTrack works with the income and expenses you add yourself, so you never share bank or card details.",
    },
    {
        question: "Is my data private?",
        answer: "Your account is password-protected and uses token-based sign-in. You only ever see your own data.",
    },
    {
        question: "Can I export my data?",
        answer: "Yes. You can download your monthly income or expenses as an Excel file, or email the report to yourself.",
    },
    {
        question: "Which currency does FinTrack use?",
        answer: "Amounts are shown in BDT (Bangladeshi taka).",
    },
    {
        question: "Does it work on my phone?",
        answer: "Yes. The layout adapts to phones, tablets and desktops, so you can add a transaction right when it happens.",
    },
    {
        question: "Why do I have to confirm my email?",
        answer: "After signing up we send an activation link. Opening it once confirms your address and unlocks your account.",
    },
];