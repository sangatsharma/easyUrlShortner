import * as React from "react";

interface IPrivateRouteProps {
  Component: React.FC;
}

const PrivateRoute: React.FunctionComponent<IPrivateRouteProps> = ({
  Component,
}) => {
  return <Component />;
};

export default PrivateRoute;
