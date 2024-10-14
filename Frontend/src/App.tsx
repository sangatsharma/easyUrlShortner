import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import PageNotFound from "./Pages/PageNotFound";
import RedirectPage from "./Pages/RedirectPage";
import RootPageLayout from "./Pages/RootPageLayout";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPageLayout />,
      errorElement: <PageNotFound />,
      children: [
        { path: ":id", element: <RedirectPage /> },
        { path: "/", element: <Homepage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
