import {useRef, useState} from "react";
import {Camera, User} from "lucide-react";

const MAX_SIZE_MB = 5;

const SIZES = {
    md: "h-24 w-24",
    lg: "h-28 w-28",
};

// Round avatar with a file picker. The parent owns the image: it passes the URL to show
// and reacts to a newly selected (validated) file or to a removal request.
const AvatarUploader = ({imageUrl, onSelect, onRemove, size = "md", disabled = false}) => {
    const inputRef = useRef(null);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const file = event.target.files?.[0];
        // Reset the input so the same file can be chosen again later
        event.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file.");
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`Image must be smaller than ${MAX_SIZE_MB} MB.`);
            return;
        }

        setError("");
        onSelect(file);
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
                <div className={`${SIZES[size]} flex items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100`}>
                    {imageUrl ? (
                        <img src={imageUrl} alt="Profile" className="h-full w-full object-cover"/>
                    ) : (
                        <User className="text-gray-400" size={size === "lg" ? 48 : 40}/>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                    aria-label={imageUrl ? "Change profile photo" : "Upload profile photo"}
                    className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full
                               border-2 border-white bg-white text-gray-700 shadow-md transition-colors duration-200
                               hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                               disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Camera size={16}/>
                </button>
            </div>

            {imageUrl && onRemove && (
                <button
                    type="button"
                    onClick={handleRemove}
                    disabled={disabled}
                    className="mt-3 cursor-pointer text-xs font-medium text-gray-500 transition-colors duration-200
                               hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Remove photo
                </button>
            )}

            {error && (
                <p role="alert" className="mt-2 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AvatarUploader;