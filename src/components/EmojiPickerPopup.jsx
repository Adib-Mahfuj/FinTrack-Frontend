import {useEffect, useRef, useState} from "react";
import EmojiPicker from "emoji-picker-react";
import {Image as ImageIcon} from "lucide-react";

// Icon field: a trigger button that expands an emoji picker inline.
// The selected emoji is stored as an image URL.
const EmojiPickerPopup = ({icon, onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        // Close the picker on a click outside of it
        const handleMouseDown = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Escape closes only the picker; the capture phase keeps the surrounding modal open
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.stopPropagation();
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
                    aria-haspopup="true"
                    className="flex cursor-pointer items-center gap-4 rounded-lg
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        {icon ? (
                            <img src={icon} alt="" className="h-7 w-7"/>
                        ) : (
                            <ImageIcon size={22}/>
                        )}
                    </span>
                    <span className="whitespace-nowrap text-sm font-medium text-gray-700">
                        {icon ? "Change Icon" : "Pick Icon"}
                    </span>
                </button>

                {icon && (
                    <button
                        type="button"
                        onClick={() => onSelect("")}
                        className="cursor-pointer text-xs font-medium text-gray-500 transition-colors duration-200 hover:text-red-600">
                        Remove
                    </button>
                )}
            </div>

            {/* Inline picker: expands inside the form, so it never overlaps or clips */}
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