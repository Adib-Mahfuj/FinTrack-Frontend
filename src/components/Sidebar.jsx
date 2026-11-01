import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { User } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assests.js";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu }) => {

    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <aside
            className="
                w-64
                h-[calc(100vh-61px)]
                bg-white
                border-r border-gray-200
                px-4 py-5
                sticky top-[61px]
                z-20
                overflow-y-auto
            "
        >

            {/* ================= Profile ================= */}
            <div
                className="
                    flex flex-col
                    items-center
                    pb-6
                    mb-5
                    border-b border-gray-100
                "
            >

                {/* Profile Image */}
                <div
                    className="
                        w-20 h-20
                        rounded-full
                        bg-blue-50
                        flex items-center justify-center
                        overflow-hidden
                        mb-3
                    "
                >
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User
                            size={38}
                            strokeWidth={1.8}
                            className="text-blue-600"
                        />
                    )}
                </div>

                {/* User Name */}
                <h5
                    className="
                        text-[15px]
                        font-semibold
                        text-gray-900
                        text-center
                        truncate
                        max-w-full
                    "
                >
                    {user?.fullName || "User"}
                </h5>

                {/* Email */}
                {user?.email && (
                    <p
                        className="
                            text-xs
                            text-gray-500
                            mt-1
                            truncate
                            max-w-full
                        "
                    >
                        {user.email}
                    </p>
                )}

            </div>


            {/* ================= Navigation ================= */}
            <nav className="space-y-1">

                {SIDE_BAR_DATA.map((item, index) => {

                    const isActive = activeMenu === item.label;

                    return (
                        <button
                            key={`menu_${index}`}
                            onClick={() => navigate(item.path)}
                            className={`
                                group
                                relative
                                w-full
                                flex items-center
                                gap-3
                                px-4 py-3
                                rounded-lg
                                text-[14px]
                                font-medium
                                text-left
                                transition-all
                                duration-200
                                ${
                                isActive
                                    ? `
                                            bg-blue-50
                                            text-blue-700
                                        `
                                    : `
                                            text-gray-700
                                            hover:bg-blue-50
                                            hover:text-blue-600
                                        `
                            }
                            `}
                        >

                            {/* Active Indicator */}
                            {isActive && (
                                <span
                                    className="
                                        absolute
                                        left-0
                                        top-1/2
                                        -translate-y-1/2
                                        w-[3px]
                                        h-6
                                        bg-blue-600
                                        rounded-r-full
                                    "
                                />
                            )}

                            {/* Icon */}
                            <item.icon
                                size={19}
                                strokeWidth={isActive ? 2.2 : 2}
                                className={`
                                    shrink-0
                                    transition-colors
                                    duration-200
                                    ${
                                    isActive
                                        ? "text-blue-600"
                                        : "text-gray-500 group-hover:text-blue-600"
                                }
                                `}
                            />

                            {/* Label */}
                            <span className="truncate">
                                {item.label}
                            </span>

                        </button>
                    );
                })}

            </nav>

        </aside>
    );
};

export default Sidebar;