import { useForm } from "react-hook-form";
import { useAuth, useSignIn } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Divider from "@/components/divider";
import Loader from "@/components/loader";
import OAuthSection from "./oAuth";
import { useEffect, useState } from "react";

type SignInFormInputs = {
  email: string;
  password: string;
};

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignInComplete, setIsSignInComplete] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  const { isLoaded, signIn } = useSignIn();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      setIsSignInComplete(true);
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);
    }
  }, [isSignedIn, navigate]); // Removed isLoaded from the dependency array

  const onSubmit = async (data: SignInFormInputs) => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      setIsSignInComplete(true);

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <Loader />;
  }

  if (isSignInComplete) {
    return (
      <div className="text-center h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-green-600">
          Logged in Successfully!
        </h2>
        <p className="text-muted-foreground mt-2">
          Redirecting you to the homepage...
        </p>
      </div>
    );
  }

  return (
    <div className="flex mt-12 flex-col max-w-[512px] min-h-[calc(100vh-52px)] py-8 mx-auto justify-center text-foreground items-center">
      <section className="flex flex-col items-center justify-center bg-secondary/20 rounded-3xl gap-6 px-8 py-12 w-full backdrop-blur-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">Sign In</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="johndoe@company.com"
              {...register("email", { required: "Email is Required!" })}
              className={cn(
                "",
                errors.email ? "border-red-500" : "border-gray-300"
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="password"
              {...register("password", { required: "Password is Required!" })}
              className={cn(
                "",
                errors.password ? "border-red-500" : "border-gray-300"
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            {/* Forgot Password */}
            <div className="flex items-center justify-end m-1 gap-1 text-sm mt-3">
              <p className="text-muted-foreground">Forgot password?</p>
              <Button
                onClick={() => {
                  navigate("/forgot-password");
                }}
                variant={"link"}
                className="text-foreground px-0"
              >
                Click Here
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-base rounded-md"
            variant={"default"}
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? <Loader /> : "Sign In"}
          </Button>
        </form>

        <Divider />

        <OAuthSection title="Continue with" mode="sign-in" />

        <p className="text-muted-foreground mt-6">
          Don't have an account?
          <a
            href="/sign-up"
            className="text-primary ml-2 hover:underline transition-all"
          >
            Sign Up
          </a>
        </p>
      </section>
    </div>
  );
}
