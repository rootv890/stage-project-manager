import { appRoutes } from "@/lib/routes";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

function SSOCallback() {
  return (
    <AuthenticateWithRedirectCallback
      continueSignUpUrl={appRoutes.auth.complete}
    />
  );
}

export default SSOCallback;
