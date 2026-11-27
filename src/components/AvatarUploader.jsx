import {useRef, useState} from "react";
import {Camera, User} from "lucide-react";
import {validateImageFile} from "../util/imageFile.js";

const SIZES = {
    sm: {box: "h-20 w-20", icon: 30, badge: "h-7 w-7", badgeIcon: 13},
    md: {box: "h-24 w-24", icon: 36, badge: "h-8 w-8", badgeIcon: 15},
    lg: {box: "h-28 w-28", icon: 44, badge: "h-9 w-9", badgeIcon: 16},
};

// Round avatar with a file picker. The parent owns the image: it passes the URL to show
// and reacts to a newly selected (validated) file or to a removal request.
const AvatarUploader = ({imageUrl, onSelect, onRemove, size = "md", disabled = false, hint}) => {
    const inputRef = useRef(null);
    const [error, setError] = useState("");
    const {box, icon, badge, badgeIcon} = SIZES[size] || SIZES.md;

    const openPicker = () => {
        if (!disabled) inputRef.current?.click();
    };

    const handleChange = (event) => {
        const file = event.target.files?.[0];
        // Reset the input so the same file can be chosen again later
        event.target.value = "";
        if (!file) return;

        const message = validateImageFile(file);
        setError(message);
        if (!message) onSelect(file);
    };

    const handleRemove = () => {
        setError("");
        onRemove();
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
            />

            <div className="relative">
                {/* Clicking the circle works too; the camera badge is the keyboard-accessible control */}
                <div
                    onClick={openPicker}
                    className={`group relative ${box} flex items-center justify-center overflow-hidden rounded-full transition-colors duration-200 ${
                        imageUrl
                            ? "border-2 border-white shadow-lg shadow-blue-900/10 ring-1 ring-gray-200"
                            : "border-2 border-dashed border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100/70"
                    } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                >
                    {imageUrl ? (
                        <>
                            <img src={imageUrl} alt="Profile" className="h-full w-full object-cover"/>
                            <span className="absolute inset-0 flex items-center justify-center bg-gray-900/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <Camera size={22} className="text-white"/>
                            </span>
                        </>
                    ) : (
                        <User className="text-blue-300" size={icon}/>
                    )}
                </div>

                <button
                    type="button"
                    onClick={openPicker}
                    disabled={disabled}
                    aria-label={imageUrl ? "Change profile photo" : "Upload profile photo"}
                    className={`absolute bottom-0 right-0 flex ${badge} cursor-pointer items-center justify-center rounded-full
                               border-2 border-white bg-blue-600 text-white shadow-md transition-colors duration-200
                               hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                               focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60`}
                >
                    <Camera size={badgeIcon}/>
                </button>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm">
                <button
                    type="button"
                    onClick={openPicker}
                    disabled={disabled}
                    className="cursor-pointer font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700
                               focus:outline-none focus-visible:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {imageUrl ? "Change photo" : "Upload photo"}
                </button>

                {imageUrl && onRemove && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={disabled}
                        className="cursor-pointer font-medium text-gray-500 transition-colors duration-200 hover:text-red-600
                                   focus:outline-none focus-visible:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Remove
                    </button>
                )}
            </div>

            {hint && !error && <p className="hide-when-short mt-0.5 text-xs text-gray-500">{hint}</p>}

            {error && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AvatarUploader;