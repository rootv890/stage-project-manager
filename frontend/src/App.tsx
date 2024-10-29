import { Navigate } from "react-router-dom";

import { useAuth, useSignIn } from "@clerk/clerk-react";

function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn } = useSignIn();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    console.log(isSignedIn);
    return <Navigate to="/sign-in" />;
    signIn?.create({
      identifier: "root31.sm@gmail.com",
      password: "Gidda!T1",
    });
  }

  return (
    <div className="h-[3500px] bg-background pt-4 max-w-screen-lg mx-auto ">
      <h1 className="text-4xl text-center">Hello World</h1>
    </div>
  );
}

export default App;
