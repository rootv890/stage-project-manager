import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./components/theme-provider";
import TopHeader from "./components/top-header";
import { Outlet } from "react-router-dom";
import { dark } from "@clerk/themes";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

// Root layout component that includes the providers and header
const RootLayout = () => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      publishableKey={clerkPublishableKey}
      afterSignOutUrl={"/"}
    >
      <ThemeProvider defaultTheme="dark" storageKey="stage-ui-theme">
        <TopHeader />
        <div className="mt-[56px]">
          <Outlet /> {/* Like Children */}
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
