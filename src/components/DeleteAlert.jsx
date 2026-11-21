import {useState} from "react";
import {LoaderCircle} from "lucide-react";

const DeleteAlert = ({content, onDelete, onCancel}) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <p className="text-sm text-gray-600">{content}</p>

            <div className="flex justify-end gap-3 mt-6">
                {/* Cancel is optional so existing usages keep working */}
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200
                        bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200
                        hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                        focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        Cancel
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg
                    bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors
                    duration-200 hover:bg-red-700 focus:outline-none focus-visible:ring-2
                    focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed
                    disabled:opacity-50">
                    {loading ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin"/>
                            Deleting...
                        </>
                    ) : (
                        "Delete"
                    )}
                </button>
            </div>
        </div>
    );
};

export default DeleteAlert;