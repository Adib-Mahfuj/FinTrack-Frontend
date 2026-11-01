import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";

const Filter = () => {
    useUser();
    return (
        <Dashboard activeMenu="Filter">
            This is Filter page.
        </Dashboard>
    )
}

export default Filter;