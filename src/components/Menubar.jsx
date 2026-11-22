import {useContext, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {LogOut, Menu, User, X} from "lucide-react";
import {AppContext} from "../context/AppContext.jsx";
import {assets} from "../assets/assests.js";
import Sidebar from "./Sidebar.jsx";

// Matches Tailwind's `lg` breakpoint, where the desktop sidebar takes over
const DESKTOP_QUERY = "(min-width: 1024px)";

// Profile photo with a user-icon fallback
const Avatar = ({url, className, iconSize}) => (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 ${className}`}>
        {url ? (
            <img src={url} alt="" className="h-full w-full object-cover"/>
        ) : (
            <User className="text-white" size={iconSize} strokeWidth={2}/>
        )}
    </span>
);

const Menubar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);
    const {user, clearUser} = useContext(AppContext);
    const navigate = useNavigate();

    const closeSideMenu = () => setOpenSideMenu(false);

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        setShowDropdown(false);
        navigate("/login");
    };

    // Close the user dropdown on outside click or Escape
    useEffect(() => {
        if (!showDropdown) return;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === "Escape") setShowDropdown(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showDropdown]);

    // Mobile drawer: Escape closes it and background scroll is locked while open
    useEffect(() => {
        if (!openSideMenu) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setOpenSideMenu(false);
        };
        document.addEventListener("keydown", handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [openSideMenu]);

    // Close the drawer when the viewport grows to the desktop layout
    useEffect(() => {
        const media = window.matchMedia(DESKTOP_QUERY);
        const handleChange = (event) => {
            if (event.matches) setOpenSideMenu(false);
        };

        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-30 flex h-[61px] items-center justify-between gap-5 border-b border-gray-200 bg-white px-4 sm:px-7">
                {/* Left: menu button + logo */}
                <div className="flex items-center gap-3 sm:gap-5">
                    <button
                        type="button"
                        onClick={() => setOpenSideMenu((open) => !open)}
                        aria-label={openSideMenu ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={openSideMenu}
                        aria-controls="mobile-navigation"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
                    >
                        {openSideMenu ? <X size={22}/> : <Menu size={22}/>}
                    </button>

                    <img src={assets.logo} alt="FinTrack logo" className="h-10 w-auto object-contain"/>
                </div>

                {/* Right: user menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setShowDropdown((open) => !open)}
                        aria-label="Open user menu"
                        aria-expanded={showDropdown}
                        className="rounded-full shadow-sm transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        <Avatar url={user?.profileImageUrl} className="h-10 w-10" iconSize={20}/>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 z-50 mt-3 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                            {/* User information */}
                            <div className="border-b border-gray-100 bg-blue-50 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar url={user?.profileImageUrl} className="h-12 w-12" iconSize={23}/>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-gray-900">
                                            {user?.fullName || "User"}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-gray-500">{user?.email || ""}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-0.5 p-1.5">
                                <Link
                                    to="/profile"
                                    onClick={() => setShowDropdown(false)}
                                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:outline-none"
                                >
                                    <User
                                        size={19}
                                        strokeWidth={2}
                                        className="text-gray-400 transition-colors duration-200 group-hover:text-blue-600"
                                    />
                                    <span className="text-sm font-medium">Profile</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:outline-none"
                                >
                                    <LogOut
                                        size={19}
                                        strokeWidth={2}
                                        className="text-gray-400 transition-colors duration-200 group-hover:text-red-600"
                                    />
                                    <span className="text-sm font-medium">Log out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile navigation drawer; `invisible` keeps hidden links out of the tab order */}
            <div
                id="mobile-navigation"
                aria-hidden={!openSideMenu}
                className={`fixed inset-x-0 bottom-0 top-[61px] z-40 transition-[visibility] duration-200 lg:hidden ${
                    openSideMenu ? "visible" : "invisible pointer-events-none"
                }`}
            >
                <div
                    onClick={closeSideMenu}
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${
                        openSideMenu ? "opacity-100" : "opacity-0"
                    }`}
                />
                <div
                    className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl transition-transform duration-200 ${
                        openSideMenu ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <Sidebar activeMenu={activeMenu} variant="drawer" onNavigate={closeSideMenu}/>
                </div>
            </div>
        </>
    );
};

export default Menubar;