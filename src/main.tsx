import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Contact from "./pages/contact.tsx";
import PageNotFound from "./pages/error-404.tsx";
import AboutMember from "./pages/about/about-member.tsx";
import SignIn from "./pages/auth/sign-in.tsx";
import RootLayout from "./layout.tsx";
import SignUp from "./pages/auth/sign-up.tsx";
import ResetPassword from "./pages/auth/reset-password.tsx";

import Onboarding from "./pages/auth/on-boarding.tsx";
import SSOCallback from "./pages/auth/sso-callback.tsx";
import { CompleteSignUp } from "./pages/auth/complete-sign-up.tsx";

/**
 * React Router
 */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: (
          <div>
            About
            <Outlet />
          </div>
        ),
        children: [
          {
            path: ":memberId",
            element: <AboutMember />,
          },
        ],
      },
      // Auth routes
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
        errorElement: <PageNotFound />,
      },
      {
        path: "/forgot-password",
        element: <ResetPassword />,
      },
      // SSO Callback route
      {
        path: "/sso-callback",
        element: <SSOCallback />,
      },
      {
        path: "/complete-sign-up",
        element: <CompleteSignUp />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
