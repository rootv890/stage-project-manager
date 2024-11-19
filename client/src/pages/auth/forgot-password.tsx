import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EmailVerificationSchema = z.object({
  email: z.string().email(),
});

const NewPasswordSchema = z.object({
  code: z.string(),
  newPassword: z.string().min(6),
});

function ForgotPasswordPage() {
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [stage, setStage] = useState<"email" | "reset">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [secondFactor, setSecondFactor] = useState(false);

  const navigate = useNavigate();

  const form = useForm<{
    email?: string;
    code?: string;
    newPassword?: string;
  }>({
    resolver: zodResolver(
      stage === "email" ? EmailVerificationSchema : NewPasswordSchema
    ),
    defaultValues: {},
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (isSignedIn) navigate("/dashboard");

  const create = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: values.email,
      });
      setStage("reset");
      setError("");
    } catch (err) {
      console.error("error", err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    }
    setIsLoading(false);
  };

  const reset = async (values: { code: string; newPassword: string }) => {
    setIsLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: values.code,
        password: values.newPassword,
      });

      if (result.status === "needs_first_factor") {
        setSecondFactor(true);
      } else if (result.status === "complete") {
        setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      }
      setError("");
    } catch (err) {
      console.error("error", err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-[50%] p-4 bg-zinc-950 border rounded-sm py-12">
      <Form {...form}>
        <form
          onSubmit={
            //@ts-expect-error - fix this
            form.handleSubmit(stage === "email" ? create : reset)
          }
          className="space-y-4"
        >
          {stage === "email" ? (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-center block">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password forgotten email!"
                      className="text-center"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reset Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your reset code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="w-full flex">
            <Button type="submit" className="mx-auto" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : stage === "email"
                ? "Send Reset Code"
                : "Reset Password"}
            </Button>
          </div>
        </form>
      </Form>

      {error && (
        <div className="bg-red-700 border w-fit mx-auto mt-4 px-6 py-1 bg-opacity-45 border-red-500 rounded-full">
          {error}
        </div>
      )}

      {secondFactor && (
        <div className="bg-red-700 border w-fit mx-auto mt-4 px-6 py-1 bg-opacity-45 border-red-500 rounded-full">
          We currently do not support 2FA for password reset. Please contact
          support.
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordPage;
