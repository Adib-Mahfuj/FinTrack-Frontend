import {lazy, Suspense, useEffect} from "react";
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";
import {LoaderCircle} from "lucide-react";
import {Toaster} from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Pages are code-split so the heavy chart library only loads when needed
const Home = lazy(() => import("./pages/Home.jsx"));
const Income = lazy(() => import("./pages/Income.jsx"));
const Expense = lazy(() => import("./pages/Expense.jsx"));
const Category = lazy(() => import("./pages/Category.jsx"));
const Filter = lazy(() => import("./pages/Filter.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));

const PageLoader = () => (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
        <LoaderCircle className="h-6 w-6 animate-spin text-gray-400"/>
    </div>
);

// Resets the scroll position on every route change
const ScrollToTop = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const Root = () => {
    const isAuthenticated = !!localStorage.getItem("token");
    return isAuthenticated ? (
        <Navigate to="/dashboard"/>
    ) : (
        <Navigate to="/login"/>
    );
}

const App = () => {
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3500,
                    style: {
                        fontSize: "14px",
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                        color: "#1f2937",
                    },
                    success: {iconTheme: {primary: "#059669", secondary: "#ffffff"}},
                    error: {iconTheme: {primary: "#dc2626", secondary: "#ffffff"}},
                }}
            />
            <BrowserRouter>
                <ScrollToTop/>
                <ErrorBoundary>
                    <Suspense fallback={<PageLoader/>}>
                        <Routes>
                            <Route path="/" element={<Root/>}/>
                            <Route path="/dashboard" element={<Home/>}/>
                            <Route path="/income" element={<Income/>}/>
                            <Route path="/expense" element={<Expense/>}/>
                            <Route path="/category" element={<Category/>}/>
                            <Route path="/filter" element={<Filter/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/signup" element={<Signup/>}/>
                            {/* Unknown URLs go back to the root redirect */}
                            <Route path="*" element={<Navigate to="/" replace/>}/>
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
            </BrowserRouter>
        </>
    )
}

export default App;