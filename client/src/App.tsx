import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "@/pages/landing-page.tsx";
import DashboardPage from "./pages/dashboard-page";
import Layout from "./layout";
import AuthLayout from "./auth-layout";
import SignUpPage from "./pages/auth/sign-up-page";
import SignInPage from "./pages/auth/sign-in-page";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import SSOCallback from "./pages/auth/sso-callback";
import { appRoutes } from "./lib/routes";
import CompeleteSignUp from "./pages/auth/complete-sign-up";

const Routers = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "/auth/sign-up",
            element: <SignUpPage />,
          },
          {
            path: "/auth/sign-in",
            element: <SignInPage />,
          },
          {
            path: "/auth/sso-callback",
            element: <SSOCallback />,
          },
          {
            path: appRoutes.auth.complete,
            element: <CompeleteSignUp />,
          },
          {
            path: "/auth/forgot-password",
            element: <ForgotPasswordPage />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={Routers} />
    </div>
  );
};

export default App;
