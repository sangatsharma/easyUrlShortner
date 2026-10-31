import * as React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

interface IRootPageLayoutProps {
  isAuthenticated: boolean;
  loading: boolean;
}

const RootPageLayout: React.FunctionComponent<IRootPageLayoutProps> = ({isAuthenticated,loading}) => {

  return (
    <div className="root-page-layout">
      <Header isAuthenticated={isAuthenticated} loading={loading}    />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootPageLayout;
