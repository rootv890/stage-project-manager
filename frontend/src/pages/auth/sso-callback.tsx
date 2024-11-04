// src/pages/auth/sso-callback.tsx

import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const SSOCallback = () => {
  return (
    <AuthenticateWithRedirectCallback continueSignUpUrl={"/complete-sign-up"} />
  );
};

export default SSOCallback;
