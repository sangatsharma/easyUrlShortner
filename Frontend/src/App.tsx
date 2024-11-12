import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import RedirectPage from "./pages/RedirectPage.tsx";
import RootPageLayout from "./pages/RootPageLayout.tsx";
import LoginForm from "./pages/LoginForm.tsx";
import SignupForm from "./pages/SignupForm.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";
import { validateToken } from "./store/authSlice.ts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store.ts";
import Analytics from "./pages/Analytics.tsx";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/:id",
      element: <RedirectPage />,
      errorElement: (
        <PageNotFound isAuthenticated={isAuthenticated} loading={loading} />
      ),
    },
    {
      path: "/",
      element: (
        <RootPageLayout isAuthenticated={isAuthenticated} loading={loading} />
      ),
      errorElement: (
        <PageNotFound isAuthenticated={isAuthenticated} loading={loading} />
      ),
      children: [
        { path: "/", element: <Homepage /> },
        {
          path: "/login",
          element: (
            <LoginForm isAuthenticated={isAuthenticated} loading={loading} />
          ),
        },
        {
          path: "/signup",
          element: (
            <SignupForm isAuthenticated={isAuthenticated} loading={loading} />
          ),
        },
        {
          path: "/dashboard",
          element: (
            <PrivateRoute
              Component={Dashboard}
              isAuthenticated={isAuthenticated}
              loading={loading}
            />
          ),
        },
        {
          path: "/analytics",
          element: (
            <PrivateRoute
              Component={Analytics}
              isAuthenticated={isAuthenticated}
              loading={loading}
            />
          ),
        },
        { path: "/forgot-password", element: <ForgotPassword /> },
        {
          path: "/404",
          element: (
            <div className="flex flex-col min-h-screen bg-gray-100">
              <Helmet>
                <title>404 - Page Not Found</title>
                <meta
                  name="description"
                  content="Sorry, the page you are looking for does not exist. Please check the URL or go back to the homepage."
                />
              </Helmet>

              <div className="flex flex-col items-center justify-center flex-grow text-center ">
                <h3 className="text-4xl text-gray-600">404</h3>
                <h1 className="text-6xl text-gray-800 mt-4">Page Not Found</h1>
                <p className="text-lg text-gray-800 mt-4">
                  The page you are looking for might have been moved or deleted.
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="text-blue-500 hover:underline text-xl"
                >
                  Go back to Home
                </button>
              </div>
            </div>
          ),
        },
      ],
    },
  ]);

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
};

export default App;
