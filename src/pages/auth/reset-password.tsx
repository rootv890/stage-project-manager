import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type ForgotPasswordInputs = {
  email: string;
  code: string;
  password: string;
};

function ResetPassword({}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>();

  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    navigate("/");
  }

  //   send code to email
  const create = async (data: ForgotPasswordInputs) => {
    try {
      setIsLoading(true);
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });

      setSuccessfulCreation(true);
      setError("");
    } catch (err) {
      // ToDO: Toaster
      console.error("Error sending reset code:", err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    } finally {
      setIsLoading(false);
    }
  };

  //   reset
  const reset = async (data: ForgotPasswordInputs) => {
    try {
      setIsLoading(true);
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        setError("");
      } else if (result.status === "complete") {
        setActive({ session: result.createdSessionId });
        setError("");
        navigate("/");
      } else {
        setError("Something went wrong");
        console.log(result);
      }
    } catch (err) {
      console.error("Error resetting password:", err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4  ">
      <div className=" flex flex-col items-center justify-center bg-muted/20 p-12 rounded-2xl ">
        <h1 className="text-xl font-medium mb-4">Forgot Password</h1>
        <form
          className="flex  items-center justify-center flex-col gap-4"
          onSubmit={handleSubmit(!successfulCreation ? create : reset)}
        >
          {!successfulCreation && (
            <>
              <label htmlFor="email">Please provide your email address</label>
              <input
                type="email"
                placeholder="e.g. john@doe.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-rose-500">{errors.email.message}</p>
              )}
              <Button className="w-full" variant={"default"} type="submit">
                {isLoading ? <Loader /> : "Send Reset Code"}
              </Button>
              {error && <p>{error}</p>}
            </>
          )}

          {successfulCreation && (
            <>
              <label htmlFor="password">Enter your new password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="New password"
              />

              {errors.password && (
                <p className="text-rose-500">{errors.password.message}</p>
              )}

              <label htmlFor="code">
                Enter the password reset code sent to your email
              </label>
              <input
                type="text"
                {...register("code", { required: "Reset code is required" })}
                placeholder="e.g. 123456"
              />
              {errors.code && <p>{errors.code.message}</p>}

              <Button className="w-full" variant={"default"} type="submit">
                {isLoading ? <Loader /> : "Reset Password"}
              </Button>

              {error && <p>{error}</p>}

              {secondFactor && (
                <p>2FA is required, but this UI does not handle that yet.</p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
