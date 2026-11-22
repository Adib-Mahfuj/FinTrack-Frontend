import {useEffect, useRef, useState} from "react";
import {Camera, Trash2, User} from "lucide-react";

const MAX_SIZE_MB = 5;

// Optional avatar picker; the parent owns the selected File via `image` / `setImage`
const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState("");

    // Build a preview URL for the selected file and release it afterwards
    useEffect(() => {
        if (!image) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(image);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [image]);

    const handleImageChange = (event) => {
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
        setImage(file);
    };

    const handleRemoveImage = () => {
        setError("");
        setImage(null);
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
                tabIndex={-1}
            />

            <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Selected profile" className="h-full w-full object-cover"/>
                    ) : (
                        <User className="text-gray-400" size={40}/>
                    )}
                </div>

                <button
                    type="button"
                    onClick={image ? handleRemoveImage : () => inputRef.current?.click()}
                    aria-label={image ? "Remove profile photo" : "Upload profile photo"}
                    className={`absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full
                                border-2 border-white bg-white shadow-md transition-colors duration-200
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                                ${image ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"}`}
                >
                    {image ? <Trash2 size={16}/> : <Camera size={16}/>}
                </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">Profile photo (optional)</p>
            {error && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;