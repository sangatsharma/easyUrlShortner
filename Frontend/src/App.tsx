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

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Validate token on app load
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
