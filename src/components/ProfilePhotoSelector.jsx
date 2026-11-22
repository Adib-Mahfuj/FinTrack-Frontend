import AvatarUploader from "./AvatarUploader.jsx";
import useObjectUrl from "../hooks/useObjectUrl.js";

// Optional avatar picker for signup; the parent owns the selected File
const ProfilePhotoSelector = ({image, setImage}) => {
    const previewUrl = useObjectUrl(image);

    return (
        <div className="flex flex-col items-center">
            <AvatarUploader
                imageUrl={previewUrl}
                onSelect={setImage}
                onRemove={() => setImage(null)}
            />
            <p className="mt-2 text-xs text-gray-500">Profile photo (optional)</p>
        </div>
    );
};

export default ProfilePhotoSelector;