import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./components/theme-provider";
import TopHeader from "./components/top-header";
import { Outlet } from "react-router-dom";
import { dark } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

// Create a new query client for react-query
const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="stage-ui-theme">
          <TopHeader />
          <div className="mt-[56px]">
            <Outlet /> {/* Like Children */}
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
