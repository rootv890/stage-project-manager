/**
 * TODO
 * 1. Sign in with email and password
 * 2. Username, email, password
 * 3. OAuth (Google, Facebook, Twitter)
 * 4. Submit Button
 * 5. Add user to neonDB (users) via webhook
 * 6. Redirect to home page
 */

import { useAuth } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSignUp } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EmailVerification, {
  EmailVerificationSchema,
} from "./email-verification";
import { useNavigate } from "react-router-dom";
import OAuthPage from "./o-auth";
import { appRoutes } from "@/lib/routes";

const SignUpFormSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  password: z.string().min(6),
});

function SignUpPage() {
  // States
  const [email, setEmail] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { setActive, isLoaded: signUpIsloaded, signUp } = useSignUp();
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {},
  });

  /**
   * SUBMIT -------------
   */
  const onSubmit = async (value: z.infer<typeof SignUpFormSchema>) => {
    // console.log(value);
    try {
      setIsloading(true);
      // 1. Create Signup
      await signUp!.create({
        emailAddress: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
        password: value.password,
        username: value.username,
      });

      setEmail(value.email);
      // 2. Verify Email
      await signUp!.prepareEmailAddressVerification();
      setVerifying(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error", error);
      setError(error.message);
    }
    // For Verification
    setIsloading(false);
  };

  const handleVerificationSubmit = async (
    value: z.infer<typeof EmailVerificationSchema>
  ) => {
    try {
      setPending(true);
      const code = value.code;
      const signUpAttempt = await signUp!.attemptEmailAddressVerification({
        code: code,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      // User Created!
      await setActive({
        session: signUpAttempt?.createdSessionId,
      });

      setPending(false);
      setVerifying(false);
      setEmail("");

      // Redirect to dashboard page
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error", error);
      setError(error.message);
    }
  };

  // ----------------------------------------

  if (isLoaded && isSignedIn) {
    return <div>Already Signed In</div>;
  }

  if (verifying) {
    return (
      <EmailVerification
        email={email}
        handleCodeSubmit={
          handleVerificationSubmit as (
            value: z.infer<typeof EmailVerificationSchema>
          ) => void
        }
        error={error}
      />
    );
  }

  return (
    <div className="w-[50%] p-4 bg-zinc-950 border rounded-sm py-12">
      <div className="space-y-2">
        <h1 className="font-bold text-2xl">Register</h1>
        <p className="text-muted-foreground">
          Create an account and unlock your journey! 🚀
        </p>

        <div>
          {/* oAUTH */}
          <OAuthPage />
        </div>

        <Separator className="bg-muted-foreground" />

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* First & Last Name */}
            <div className="flex w-full  gap-2 justify-between">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ross" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Geller" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* UserName */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="dinosaurs_ross" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ross-geller@dinosaurs.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="iLoveR@chel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Sign Up */}
            <Button>
              <span>{isLoading ? "Loading" : "Sign up"}</span>
            </Button>
          </form>
        </Form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Sign In */}
      <div className="flex pr-4 items-center justify-end mt-4 gap-2">
        <p>Already have an Account? </p>
        <button
          className="inline hover:text-zinc-300"
          onClick={() => navigate(appRoutes.auth.signIn)}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default SignUpPage;
