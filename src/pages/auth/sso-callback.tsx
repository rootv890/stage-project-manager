// src/pages/auth/sso-callback.tsx

import { useEffect } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const SSOCallback = () => {
  return (
    <AuthenticateWithRedirectCallback continueSignUpUrl={"/complete-sign-up"} />
  );
};

export default SSOCallback;
