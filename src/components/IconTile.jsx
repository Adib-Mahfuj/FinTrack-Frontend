import {useEffect, useState} from "react";
import {Wallet} from "lucide-react";

const SIZES = {
    md: "h-11 w-11",
    lg: "h-12 w-12",
};

// Emoji/icon tile with a fallback icon; turns white when the parent `group` is hovered
const IconTile = ({icon, size = "md"}) => {
    const [failed, setFailed] = useState(false);

    useEffect(() => setFailed(false), [icon]);

    return (
        <div className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-lg bg-gray-100
                         transition-colors duration-200 group-hover:bg-white`}>
            {icon && !failed ? (
                <img src={icon} alt="" className="h-6 w-6" onError={() => setFailed(true)}/>
            ) : (
                <Wallet size={20} className="text-blue-600"/>
            )}
        </div>
    );
};

export default IconTile;