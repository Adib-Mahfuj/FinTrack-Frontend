import {API_ENDPOINTS} from "./apiEndpoints.js";

const CLOUDINARY_UPLOAD_PRESET = "fintrack";

// Uploads an image to Cloudinary and returns its secure URL
const uploadProfileImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            // Cloudinary reports failures as { error: { message } }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || response.statusText);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Error in uploading image", error);
        // Callers show this message to the user, so keep it friendly
        throw new Error("Image upload failed. Please try again.");
    }
}

export default uploadProfileImage;