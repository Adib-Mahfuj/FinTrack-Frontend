import {useContext} from "react";
import {Link} from "react-router-dom";
import {User} from "lucide-react";
import {AppContext} from "../context/AppContext.jsx";
import {SIDE_BAR_DATA} from "../assets/assests.js";

// "desktop" sticks under the top bar; "drawer" fills the mobile navigation panel
const VARIANTS = {
    desktop: "sticky top-[61px] z-20 h-[calc(100vh-61px)] w-64 border-r border-gray-200",
    drawer: "h-full w-full",
};

const Sidebar = ({activeMenu, variant = "desktop", onNavigate}) => {
    const {user} = useContext(AppContext);

    return (
        <aside className={`overflow-y-auto bg-white px-4 py-5 ${VARIANTS[variant]}`}>
            {/* Profile */}
            <div className="mb-5 flex flex-col items-center border-b border-gray-100 pb-6">
                <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-50">
                    {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile" className="h-full w-full object-cover"/>
                    ) : (
                        <User size={38} strokeWidth={1.8} className="text-blue-600"/>
                    )}
                </div>

                <h5 className="max-w-full truncate text-center text-[15px] font-semibold text-gray-900">
                    {user?.fullName || "User"}
                </h5>

                {user?.email && (
                    <p className="mt-1 max-w-full truncate text-xs text-gray-500">{user.email}</p>
                )}
            </div>

            {/* Navigation (real links: keyboard friendly, open in a new tab) */}
            <nav className="space-y-1" aria-label="Main navigation">
                {SIDE_BAR_DATA.map((item) => {
                    const isActive = activeMenu === item.label;

                    return (
                        <Link
                            key={item.path ?? item.label}
                            to={item.path}
                            onClick={onNavigate}
                            aria-current={isActive ? "page" : undefined}
                            className={`group relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[14px] font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-600"/>
                            )}

                            <item.icon
                                size={19}
                                strokeWidth={isActive ? 2.2 : 2}
                                className={`shrink-0 transition-colors duration-200 ${
                                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                                }`}
                            />

                            <span className="truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;