import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { ClerkProvider } from "@clerk/clerk-react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Contact from "./pages/contact.tsx";
import PageNotFound from "./pages/error-404.tsx";
import TopHeader from "./components/top-header.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import AboutMember from "./pages/about/about-member.tsx";
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("clerkPublishableKey", clerkPublishableKey);
if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

/**
 * React Router
 */

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
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
    // nesting routes
    children: [
      {
        path: ":memberId",
        element: <AboutMember />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl={"/"}>
      <ThemeProvider defaultTheme="dark" storageKey="stage-ui-theme">
        <TopHeader />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
);
