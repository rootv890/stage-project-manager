import Divider from "@/components/divider";
import { Button } from "@/components/ui/button";
import { useAuth, useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import OAuthSection from "./oAuth";

type SignUpFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
  firstName?: string;
  lastName?: string;
};

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<SignUpFormInputs>();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const [signUpComplete, setSignUpComplete] = useState(false);

  const { isSignedIn } = useAuth();
  const { signUp, isLoaded } = useSignUp();

  if (isLoaded && isSignedIn) {
    console.log("User is already signed in");
    navigate("/");
    return null;
  }

  /**
   * Handle Sign Up form submission
   */
  const onSubmit = async (data: SignUpFormInputs) => {
    if (!isLoaded) return;
    try {
      setLoading(true);

      // First, create the user
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        username: data.userName || undefined,
      });

      console.log("Sign Up Result:", result);

      // Specifically handle the email verification
      if (result.status === "missing_requirements") {
        // Directly request email verification
        const verificationResult =
          await signUp.prepareEmailAddressVerification();
        console.log("Verification preparation:", verificationResult);
        setPendingVerification(true);
      } else if (result.status === "complete") {
        console.log("Signup complete", result);

        navigate("/");
      }
    } catch (err: any) {
      console.error("Sign Up Error:", err);

      if (err.errors) {
        err.errors.forEach((error: any) => {
          const field = error.meta?.paramName;

          if (field) {
            setError(field as keyof SignUpFormInputs, {
              message: error.message,
            });
          } else {
            setError("root", {
              message: error.message || "An error occurred during sign up",
            });
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle verification code submission
   */
  const onVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !code.trim()) return;

    try {
      setVerifying(true);

      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        console.log("Verification successful", result);
        setSignUpComplete(true);

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        console.log("Verification incomplete:", result);
        setError("root", {
          message: "Verification failed. Please try again.",
        });
      }
    } catch (err: any) {
      console.error("Verification Error:", err);
      setError("root", {
        message: err.message || "Error verifying email",
      });
    } finally {
      setVerifying(false);
    }
  };

  // Pending Verification
  if (pendingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 w-full">
        <div className="w-full max-w-md space-y-8 p-6  rounded-lg shadow-lg flex flex-col items-center ">
          {signUpComplete ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600">
                Account Created Successfully!
              </h2>
              <p className="text-muted-foreground mt-2">
                Redirecting you to the homepage...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Verify your email</h2>
                <p className="text-muted-foreground mt-2">
                  Stage has sent you a verification code. Please check your
                  email.
                </p>
              </div>
              <form onSubmit={onVerifyCode}>
                <div>
                  <label htmlFor="code">
                    Verification Code
                    <span className="text-sm">(6 digits)</span>
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                    required
                  />
                </div>

                <Button
                  disabled={verifying}
                  type="submit"
                  className="w-full mt-4"
                  variant={"default"}
                >
                  {verifying ? "Verifying..." : "Verify"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex mt-12 flex-col max-w-[512px] min-h-[calc(100vh-52px)] py-8 mx-auto justify-center text-foreground items-center">
      <section className="flex flex-col items-center justify-center bg-secondary/20 rounded-3xl gap-6 px-8 py-12 w-full backdrop-blur-2xl shadow-lg">
        <div className="text-center ">
          <h1 className="text-3xl font-semibold mb-4">Sign Up Form</h1>
          <p className="text-muted-foreground mt-2">
            Fill in your details to get started
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4 mt-4 w-full"
        >
          {/* Email */}
          <div id="email-div">
            <label htmlFor="email">Email</label>
            <input
              placeholder="janedoe@company.com"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Entered value does not match email format",
                },
              })}
            />
            {errors.email && <Validation error={errors.email} />}
          </div>
          {/* Username */}
          <div id="username-div">
            <label htmlFor="username">Username</label>
            <input
              placeholder="janedoe29"
              type="text"
              {...register("userName", {
                required: "Username is required",
              })}
            />
            {errors.userName && <Validation error={errors.userName} />}
          </div>

          {/* First & last Name */}

          <div className="flex gap-2">
            <div>
              <label htmlFor="firstName">
                First Name
                <span className="text-sm">(optional)</span>
              </label>
              <input
                placeholder="Jane"
                type="text"
                {...register("firstName", {
                  required: "First Name is required",
                })}
              />
              {errors.firstName && <Validation error={errors.firstName} />}
            </div>

            <div>
              <label htmlFor="lastName">
                Last Name
                <span className="text-sm">(optional)</span>
              </label>
              <input
                placeholder="Doe"
                type="text"
                {...register("lastName", {
                  required: "Last Name is required",
                })}
              />
              {errors.lastName && <Validation error={errors.lastName} />}
            </div>
          </div>
          {/* Password */}

          <div>
            <label htmlFor="password">Password</label>
            <input
              placeholder="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
              })}
            />
            {errors.password && <Validation error={errors.password} />}
          </div>

          {/* Confirm Password */}

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              placeholder="password"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <Validation error={errors.confirmPassword} />
            )}
          </div>

          {errors.root && <Validation error={errors.root} />}

          {/* Submit Button */}
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-muted-foreground mt-6">
            Already have an account?
            <a
              href="/sign-in"
              className="text-primary ml-2 hover:underline transition-all"
            >
              Sign In
            </a>
          </p>
        </form>

        <Divider />

        <OAuthSection title="Sign Up with " mode="sign-up" />
      </section>
    </div>
  );
};

export default SignUp;

function Validation({
  error,
}: {
  error: {
    message: any;
  };
}) {
  return (
    <p className="mt-1 text-sm p-3 rounded-md bg-destructive/30 text-destructive">
      {error.message}
    </p>
  );
}
