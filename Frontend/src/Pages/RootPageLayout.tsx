import * as React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

interface IRootPageLayoutProps {}

const RootPageLayout: React.FunctionComponent<IRootPageLayoutProps> = () => {
  return (
    <div className="root-page-layout">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootPageLayout;
