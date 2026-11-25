import {useRef, useState} from "react";
import {User} from "lucide-react";
import useObjectUrl from "../hooks/useObjectUrl.js";
import {validateImageFile} from "../util/imageFile.js";

// Compact optional photo row for signup; the parent owns the selected File
const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);
    const [error, setError] = useState("");
    const previewUrl = useObjectUrl(image);

    const handleChange = (event) => {
        const file = event.target.files?.[0];
        // Reset the input so the same file can be chosen again later
        event.target.value = "";
        if (!file) return;

        const message = validateImageFile(file);
        setError(message);
        if (!message) setImage(file);
    };

    const handleRemove = () => {
        setError("");
        setImage(null);
    };

    return (
        <div className="mb-5">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
            />

            <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Selected profile" className="h-full w-full object-cover"/>
                    ) : (
                        <User size={24} className="text-gray-400"/>
                    )}
                </span>

                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700">
                        Profile photo <span className="font-normal text-gray-500">(optional)</span>
                    </p>

                    <div className="mt-1 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="cursor-pointer text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700
                                       focus:outline-none focus-visible:underline"
                        >
                            {image ? "Change" : "Upload"}
                        </button>

                        {image && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="cursor-pointer text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-red-600
                                           focus:outline-none focus-visible:underline"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <p role="alert" className="mt-2 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;