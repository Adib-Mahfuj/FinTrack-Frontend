import {useState} from "react";
import {LoaderCircle} from "lucide-react";

const DeleteAlert = ({content, onDelete}) => {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <p className="text-sm">{content}</p>
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    type="button"
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
                        <>
                            Delete
                        </>
                    )}
                </button>

            </div>
        </div>
    )
}

export default DeleteAlert;