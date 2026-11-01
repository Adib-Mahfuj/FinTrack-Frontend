import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../context/AppContext.jsx";
import {useNavigate} from "react-router-dom";
import {LogOut, Menu, User, X} from "lucide-react";
import {assets} from "../assets/assests.js";
import Sidebar from "./Sidebar.jsx";

const Menubar = ({activeMenu}) => {

    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    const {user, clearUser} = useContext(AppContext);
    const navigate = useNavigate();


    // ================= Logout =================
    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        setShowDropdown(false);
        navigate("/login");
    };


    // ================= Close Dropdown Outside =================
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }

        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, [showDropdown]);


    return (
        <header
            className="
                flex items-center justify-between
                gap-5
                h-[61px]
                bg-white
                border-b border-gray-200
                px-4 sm:px-7
                sticky top-0
                z-30
            "
        >

            {/* ================= Left Section ================= */}
            <div className="flex items-center gap-5">

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                    aria-label={
                        openSideMenu
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={openSideMenu}
                    className="
                        flex lg:hidden
                        items-center justify-center
                        w-9 h-9
                        text-gray-600
                        hover:text-gray-900
                        hover:bg-gray-100
                        rounded-lg
                        transition-colors
                        duration-200
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:ring-offset-1
                    "
                >
                    {openSideMenu ? (
                        <X size={22}/>
                    ) : (
                        <Menu size={22}/>
                    )}
                </button>


                {/* Logo */}
                <div className="flex items-center gap-2">

                    <img
                        src={assets.logo}
                        alt="FinTrack logo"
                        className="w-40 h-40 object-contain"
                    />

                    {/*
                    <span
                        className="
                            text-lg
                            font-semibold
                            text-gray-900
                            tracking-tight
                        "
                    >
                        FinTrack
                    </span>
                    */}


                </div>

            </div>


            {/* ================= Right Section ================= */}
            <div
                className="relative"
                ref={dropdownRef}
            >

                {/* User Avatar Button */}
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    aria-label="Open user menu"
                    aria-expanded={showDropdown}
                    className="
                        flex items-center justify-center
                        w-10 h-10
                        bg-blue-600
                        hover:bg-blue-700
                        rounded-full
                        transition-colors
                        duration-200
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:ring-offset-2
                        shadow-sm
                        hover:shadow-md
                    "
                >
                    <User
                        className="text-white"
                        size={20}
                        strokeWidth={2}
                    />
                </button>


                {/* ================= Dropdown ================= */}
                {showDropdown && (

                    <div
                        className="
                            absolute
                            right-0
                            mt-3
                            w-72
                            bg-white
                            rounded-xl
                            border border-gray-200
                            shadow-xl
                            overflow-hidden
                            z-50
                        "
                    >

                        {/* User Information */}
                        <div
                            className="
                                px-4 py-4
                                bg-blue-50
                                border-b border-gray-100
                            "
                        >

                            <div className="flex items-center gap-3">

                                {/* User Avatar */}
                                <div
                                    className="
                                        flex items-center justify-center
                                        w-12 h-12
                                        bg-blue-600
                                        rounded-full
                                        shrink-0
                                    "
                                >
                                    <User
                                        className="text-white"
                                        size={23}
                                        strokeWidth={2}
                                    />
                                </div>


                                {/* User Details */}
                                <div className="flex-1 min-w-0">

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-gray-900
                                            truncate
                                        "
                                    >
                                        {user?.fullName || "User"}
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-gray-500
                                            mt-0.5
                                            truncate
                                        "
                                    >
                                        {user?.email || ""}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ================= Dropdown Actions ================= */}
                        <div className="p-1.5">

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="
                                    group
                                    w-full
                                    flex items-center
                                    gap-3
                                    px-3 py-2.5
                                    rounded-lg
                                    text-left
                                    text-gray-700
                                    hover:bg-red-50
                                    hover:text-red-600
                                    transition-colors
                                    duration-200
                                    focus:outline-none
                                    focus:bg-red-50
                                "
                            >

                                <LogOut
                                    size={19}
                                    strokeWidth={2}
                                    className="
                                        text-gray-400
                                        group-hover:text-red-600
                                        transition-colors
                                        duration-200
                                    "
                                />

                                <span
                                    className="
                                        text-sm
                                        font-medium
                                    "
                                >
                                    Log out
                                </span>

                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* ================= Mobile Sidebar ================= */}
            {openSideMenu && (

                <div
                    className="
                        fixed
                        left-0 right-0
                        top-[61px]
                        bg-white
                        border-b border-gray-200
                        lg:hidden
                        z-20
                    "
                >
                    <Sidebar activeMenu={activeMenu}/>
                </div>

            )}

        </header>
    );
};

export default Menubar;