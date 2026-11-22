import {useEffect, useState} from "react";

// Object URL for a File, revoked automatically when the file changes or the component unmounts
const useObjectUrl = (file) => {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (!file) {
            setUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return url;
};

export default useObjectUrl;