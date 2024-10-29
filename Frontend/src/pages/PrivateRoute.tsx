import * as React from "react";
import LoginForm from "./LoginForm";

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
  return isAuthenticated ? (
    <Component />
  ) : (
    <LoginForm isAuthenticated={isAuthenticated} loading={loading} />
  );
};

export default PrivateRoute;
