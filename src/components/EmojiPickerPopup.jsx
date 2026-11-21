import {useEffect, useRef, useState} from "react";
import EmojiPicker from "emoji-picker-react";
import {Image as ImageIcon} from "lucide-react";

const EmojiPickerPopup = ({icon, onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleMouseDown = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKeyDown, true);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKeyDown, true);
        };
    }, [isOpen]);

    const handleEmojiClick = (emoji) => {
        onSelect(emoji?.imageUrl || "");
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="mb-6">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    className="flex items-center gap-4 rounded-lg cursor-pointer
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                    <span className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        {icon ? (
                            <img src={icon} alt="" className="w-7 h-7"/>
                        ) : (
                            <ImageIcon size={22}/>
                        )}
                    </span>
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        {icon ? "Change Icon" : "Pick Icon"}
                    </span>
                </button>

                {icon && (
                    <button
                        type="button"
                        onClick={() => onSelect("")}
                        className="text-xs font-medium text-gray-500 hover:text-red-600
                                   transition-colors duration-200 cursor-pointer">
                        Remove
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="mt-3">
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width="100%"
                        height={320}
                        previewConfig={{showPreview: false}}
                        skinTonesDisabled
                    />
                </div>
            )}
        </div>
    );
};

export default EmojiPickerPopup;