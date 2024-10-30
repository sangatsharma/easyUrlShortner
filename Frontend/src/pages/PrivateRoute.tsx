import * as React from "react";
import { Navigate } from "react-router-dom";

interface IPrivateRouteProps {
  isAuthenticated: boolean;
  loading: boolean;
  Component: React.FC;
}

const PrivateRoute: React.FunctionComponent<IPrivateRouteProps> = ({
  Component,
  isAuthenticated,
  loading,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
