import {Component} from "react";
import {RefreshCw} from "lucide-react";
import Button from "./Button.jsx";

// Catches render errors (and failed lazy chunks) so the user never sees a blank screen
class ErrorBoundary extends Component {
    state = {hasError: false};

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error, info) {
        console.error("Unhandled UI error", error, info);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
                <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
                <p className="mt-2 max-w-sm text-sm text-gray-500">
                    An unexpected error occurred. Reloading the page usually fixes it.
                </p>
                <Button className="mt-6" icon={RefreshCw} onClick={() => window.location.reload()}>
                    Reload page
                </Button>
            </div>
        );
    }
}

export default ErrorBoundary;