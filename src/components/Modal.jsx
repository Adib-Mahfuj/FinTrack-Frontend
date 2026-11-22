import {createContext, useContext, useEffect, useState} from "react";
import {X} from "lucide-react";

// Lets forms rendered inside a modal close it (e.g. a Cancel button) without extra props
const ModalContext = createContext({onClose: null});

export const useModal = () => useContext(ModalContext);

const Modal = ({isOpen, onClose, children, title, maxWidth = "max-w-md"}) => {
    const [visible, setVisible] = useState(false);

    // Flip on the next frame so the enter transition can run
    useEffect(() => {
        if (!isOpen) {
            setVisible(false);
            return;
        }

        const frame = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(frame);
    }, [isOpen]);

    // Escape closes the modal; background scroll is locked while it is open
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <ModalContext.Provider value={{onClose}}>
            <div
                className={`fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-hidden bg-black/30 backdrop-blur-md transition-opacity duration-200 ${
                    visible ? "opacity-100" : "opacity-0"
                }`}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                    className={`relative max-h-[90vh] w-full overflow-y-auto p-4 transition duration-200 ${maxWidth} ${
                        visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
                >
                    <div className="relative rounded-xl border border-gray-100 bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between rounded-t-xl border-b border-gray-100 p-5 md:p-6">
                            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

                            <button
                                onClick={onClose}
                                type="button"
                                aria-label="Close"
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                <X className="h-4 w-4"/>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 text-gray-700 md:p-6">{children}</div>
                    </div>
                </div>
            </div>
        </ModalContext.Provider>
    )
}

export default Modal;