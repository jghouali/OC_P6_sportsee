import { AuthContext } from "../context/AuthProvider/AuthProvider";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";

function Logout() {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    useEffect(() => {
        setAuth({ userInfo: null });

        document.cookie =
            "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

        navigate("/login", { replace: true });
    }, [setAuth, navigate]);

    return null;
}

export default Logout;