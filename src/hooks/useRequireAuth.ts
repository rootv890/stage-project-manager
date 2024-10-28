import { useAuth } from "@clerk/clerk-react";

export default function useRequireAuth() {
  const { isSignedIn } = useAuth();
  return isSignedIn; // return true or false
}
