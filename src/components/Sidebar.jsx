import {useContext} from "react";
import {Link} from "react-router-dom";
import {ChevronRight, User} from "lucide-react";
import {AppContext} from "../context/AppContext.jsx";
import {SIDE_BAR_DATA} from "../assets/assests.js";

// "desktop" sticks under the top bar; "drawer" fills the mobile navigation panel
const VARIANTS = {
    desktop: "sticky top-[61px] z-20 h-[calc(100vh-61px)] w-64 border-r border-gray-200",
    drawer: "h-full w-full",
};

// Sections are matched against the menu labels in SIDE_BAR_DATA
const NAV_SECTIONS = [
    {title: null, labels: ["Dashboard"]},
    {title: "Transactions", labels: ["Income", "Expense", "Filter"]},
    {title: "Organize", labels: ["Category"]},
];

const buildSections = () => {
    const byLabel = new Map(SIDE_BAR_DATA.map((item) => [item.label, item]));
    const placed = new Set();

    const sections = NAV_SECTIONS.map(({title, labels}) => {
        const items = labels.map((label) => byLabel.get(label)).filter(Boolean);
        items.forEach((item) => placed.add(item.label));
        return {title, items};
    });

    // Menu items missing from the list above still appear
    const rest = SIDE_BAR_DATA.filter((item) => !placed.has(item.label));
    if (rest.length > 0) sections.push({title: "More", items: rest});

    return sections.filter((section) => section.items.length > 0);
};

const SECTIONS = buildSections();

const NavItem = ({item, isActive, onNavigate}) => (
    <Link
        to={item.path}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
    >
        <item.icon
            size={18}
            strokeWidth={isActive ? 2.25 : 2}
            className={`shrink-0 transition-colors duration-150 ${
                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
            }`}
        />
        <span className="truncate">{item.label}</span>
    </Link>
);

// Compact account card pinned to the bottom of the sidebar
const UserCard = ({user, isActive, onNavigate}) => (
    <Link
        to="/profile"
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={`mt-4 flex items-center gap-3 rounded-xl border p-2.5 transition-colors duration-150
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${isActive ? "border-blue-200 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
    >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50">
            {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="" className="h-full w-full object-cover"/>
            ) : (
                <User size={18} className="text-blue-600"/>
            )}
        </span>

        <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900">{user?.fullName || "User"}</span>
            {user?.email && <span className="block truncate text-xs text-gray-500">{user.email}</span>}
        </span>

        <ChevronRight size={16} className="shrink-0 text-gray-400"/>
    </Link>
);

const Sidebar = ({activeMenu, variant = "desktop", onNavigate}) => {
    const {user} = useContext(AppContext);

    return (
        <aside className={`flex flex-col overflow-y-auto bg-white px-3 py-4 ${VARIANTS[variant]}`}>
            <nav aria-label="Main navigation" className="flex-1 space-y-6">
                {SECTIONS.map((section) => (
                    <div key={section.title ?? "main"}>
                        {section.title && (
                            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                {section.title}
                            </p>
                        )}

                        <ul className="space-y-0.5">
                            {section.items.map((item) => (
                                <li key={item.path ?? item.label}>
                                    <NavItem
                                        item={item}
                                        isActive={activeMenu === item.label}
                                        onNavigate={onNavigate}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <UserCard user={user} isActive={activeMenu === "Profile"} onNavigate={onNavigate}/>
        </aside>
    );
};

export default Sidebar;