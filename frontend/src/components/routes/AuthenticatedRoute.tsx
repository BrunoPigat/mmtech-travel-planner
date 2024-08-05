import React from "react";
import {useAuth} from "../../contexts/AuthContext";
import {Navigate} from "react-router-dom";

const AuthenticatedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
    const { username } = useAuth();

    return username ? element : <Navigate to="/signin" />;
};

export default AuthenticatedRoute;