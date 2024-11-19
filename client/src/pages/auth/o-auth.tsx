import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/routes";
import {} from "@clerk/clerk-react";
import { useSignIn } from "@clerk/clerk-react";
import { sign } from "crypto";
import { FaApple, FaDiscord, FaGithub, FaGoogle } from "react-icons/fa6";
import { redirect } from "react-router-dom";

type OAuthProvider =
  | "facebook"
  | "google"
  | "hubspot"
  | "github"
  | "tiktok"
  | "gitlab"
  | "discord"
  | "twitter"
  | "twitch"
  | "linkedin"
  | "linkedin_oidc"
  | "dropbox"
  | "bitbucket"
  | "microsoft"
  | "notion"
  | "apple"
  | "x";

type OAuthStrategy = `oauth_${OAuthProvider}`;

function OAuthPage() {
  const { signIn, isLoaded } = useSignIn();

  //  if not signed in, return null
  if (!signIn) return null;

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy: strategy,
      redirectUrl: appRoutes.auth.ssoCallback,
      redirectUrlComplete: appRoutes.dashboard.index,
    });
  };

  return (
    <div className="flex gap-3 items-center justify-center">
      <Button onClick={() => signInWith("oauth_github")} variant={"o-auth"}>
        <FaGithub />
      </Button>
      <Button onClick={() => signInWith("oauth_google")} variant={"o-auth"}>
        <FaGoogle />
      </Button>
      <Button onClick={() => signInWith("oauth_discord")} variant={"o-auth"}>
        <FaDiscord />
      </Button>
      <Button onClick={() => signInWith("oauth_apple")} variant={"o-auth"}>
        <FaApple />
      </Button>
    </div>
  );
}

export default OAuthPage;
