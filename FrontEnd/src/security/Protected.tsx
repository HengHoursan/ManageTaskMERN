
import { Navigate } from "react-router-dom";
import Home from  '../views/Home.tsx'

const Protected = () => {
    const token = localStorage.getItem("token");

    if (token) {
        return <Home/>;
    }

    return <Navigate to="/" replace />;
};

export default Protected;
