import { Button } from "@/components/ui/button";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { OAuthStrategy } from "@clerk/types";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";

interface OAuthSectionProps {
  title: string;
  mode: "sign-in" | "sign-up";
}

const OAuthSection = ({ title, mode }: OAuthSectionProps) => {
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();

  const handleOAuthSignIn = async (provider: OAuthStrategy) => {
    if (mode === "sign-in" && isSignInLoaded) {
      try {
        await signIn.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: "/sso-callback", // Dedicated route for OAuth callbacks
          redirectUrlComplete: "/", // Redirect to homepage or dashboard after success
        });
      } catch (error) {
        console.error(`Sign-in with ${provider} failed:`, error);
      }
    } else if (mode === "sign-up" && isSignUpLoaded) {
      try {
        await signUp.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: "/sso-callback", // Dedicated route for OAuth callbacks
          redirectUrlComplete: "/", // Redirect to homepage or dashboard after success
        });
      } catch (error) {
        console.error(`Sign-up with ${provider} failed:`, error);
      }
    } else {
      console.error("Clerk is not loaded yet.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-gray-600">{title}</p>

      <Button
        onClick={() => handleOAuthSignIn("oauth_google")}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <FcGoogle className="h-5 w-5" />
        {mode === "sign-in" ? "Sign In" : "Sign Up"} with Google
      </Button>

      <Button
        onClick={() => handleOAuthSignIn("oauth_github")}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <IoLogoGithub className="h-5 w-5" />
        {mode === "sign-in" ? "Sign In" : "Sign Up"} with GitHub
      </Button>

      <Button
        onClick={() => handleOAuthSignIn("oauth_apple")}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <FaApple className="h-5 w-5" />
        {mode === "sign-in" ? "Sign In" : "Sign Up"} with Apple
      </Button>
    </div>
  );
};

export default OAuthSection;
