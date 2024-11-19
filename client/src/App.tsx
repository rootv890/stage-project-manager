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
import { NotificationProvider } from "./providers/notification-provider";

const Routers = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: appRoutes.home,
        element: <LandingPage />,
      },
      {
        path: appRoutes.dashboard.index,
        element: <DashboardPage />,
      },
      {
        path: appRoutes.auth.index,
        element: <AuthLayout />,
        children: [
          {
            path: appRoutes.auth.signUp,
            element: <SignUpPage />,
          },
          {
            path: appRoutes.auth.signIn,
            element: <SignInPage />,
          },
          {
            path: appRoutes.auth.ssoCallback,
            element: <SSOCallback />,
          },
          {
            path: appRoutes.auth.complete,
            element: <CompeleteSignUp />,
          },
          {
            path: appRoutes.auth.forgotPassword,
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
