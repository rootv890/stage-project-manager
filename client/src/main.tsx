import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {ClerkProvider} from '@clerk/clerk-react'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");


createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl={'/'}>
            <App/>
        </ClerkProvider>
    </StrictMode>
);
