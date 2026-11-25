export const MAX_IMAGE_SIZE_MB = 5;

// Returns an error message for an unusable image file, or an empty string when it is fine
export const validateImageFile = (file) => {
    if (!file.type.startsWith("image/")) return "Please choose an image file.";

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        return `Image must be smaller than ${MAX_IMAGE_SIZE_MB} MB.`;
    }

    return "";
};