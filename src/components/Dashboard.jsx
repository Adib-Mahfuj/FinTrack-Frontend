import {useContext, useEffect} from "react";
import {LoaderCircle} from "lucide-react";
import Menubar from "./Menubar.jsx";
import Sidebar from "./Sidebar.jsx";
import {AppContext} from "../context/AppContext.jsx";

// App shell: top bar, desktop sidebar and the page content area
const Dashboard = ({children, activeMenu}) => {
    const {user} = useContext(AppContext);

    // Keep the browser tab title in sync with the current page
    useEffect(() => {
        document.title = `${activeMenu} · FinTrack`;
    }, [activeMenu]);

    return (
        <div className="min-h-screen">
            <Menubar activeMenu={activeMenu}/>

            {user ? (
                <div className="flex">
                    {/* Below the lg breakpoint the sidebar is a drawer (see Menubar) */}
                    <div className="hidden lg:block">
                        <Sidebar activeMenu={activeMenu}/>
                    </div>

                    {/* min-w-0 lets wide children (charts, lists) shrink instead of overflowing */}
                    <main className="min-w-0 grow px-4 pb-10 sm:px-5">
                        {children}
                    </main>
                </div>
            ) : (
                <div className="flex justify-center py-24" role="status" aria-label="Loading">
                    <LoaderCircle className="h-6 w-6 animate-spin text-gray-400"/>
                </div>
            )}
        </div>
    );
};

export default Dashboard;