import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import PageNotFound from "./Pages/PageNotFound";
import RedirectPage from "./Pages/RedirectPage";
import RootPageLayout from "./Pages/RootPageLayout";
import LoginForm from "./Pages/LoginForm";
import SignupForm from "./Pages/SignupForm";
import ForgotPassword from "./Pages/ForgotPassword";

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
        { path: "/login", element: <LoginForm /> },
        { path: "/signup", element: <SignupForm/> },
        { path: "/forgot-password", element: <ForgotPassword/> },
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
