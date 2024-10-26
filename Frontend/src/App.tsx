import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import RedirectPage from "./pages/RedirectPage";
import RootPageLayout from "./pages/RootPageLayout";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./pages/PrivateRoute";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  const router = createBrowserRouter([
    { path: "/:id", element: <RedirectPage />, errorElement: <PageNotFound /> },
    {
      path: "/",
      element: <RootPageLayout />,
      errorElement: <PageNotFound />,
      children: [
        { path: ":id", element: <RedirectPage /> },
        { path: "/", element: <Homepage /> },
        { path: "/login", element: <LoginForm /> },
        { path: "/signup", element: <SignupForm /> },
        { path: "/dashboard", element: <PrivateRoute Component={Dashboard} /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        {
          path: "/404",
          element: (
            <div className="flex flex-col min-h-screen bg-gray-100">
              <h3 className="text-4xl text-center mt-4">404 </h3>
              <h1 className="text-6xl text-center mt-4">Page not found.</h1>
            </div>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
