import {useRef, useState, useEffect} from "react";
import {Trash, Upload, User} from "lucide-react";

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Cleanup object URL to prevent memory leak
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);

            // Revoke old preview URL before creating new one
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newPreviewUrl);
        }
    };

    const handleRemoveImage = (e) => {
        e.preventDefault();
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setImage(null);
        setPreviewUrl(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const onChooseFile = (e) => {
        e.preventDefault();
        inputRef.current?.click();
    };

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />
            {!image ? (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full relative border-2 border-gray-200">
                    <User className="text-gray-400" size={40}/>

                    <button
                        onClick={onChooseFile}
                        className="w-9 h-9 flex items-center justify-center bg-white text-gray-700 rounded-full absolute bottom-0 right-0 hover:bg-gray-50 transition-colors shadow-lg border-2 border-white">
                        <Upload size={16}/>
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img src={previewUrl} alt="Profile Photo" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"/>
                    <button
                        onClick={handleRemoveImage}
                        className="w-9 h-9 flex items-center justify-center bg-white text-red-500 rounded-full absolute bottom-0 right-0 hover:bg-red-50 transition-colors shadow-lg border-2 border-white">
                        <Trash size={16}/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;