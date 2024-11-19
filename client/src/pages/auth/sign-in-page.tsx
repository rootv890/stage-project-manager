import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
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
import { useState } from "react";
import { useClerk, useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/lib/routes";

const SignInSchema = z.object({
  email: z.union([z.string().email(), z.string().min(3)]),
  password: z.string(),
});

function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof SignInSchema>) => {
    try {
      setIsLoading(true);
      const data = await signIn?.create({
        identifier: value.email,
        password: value.password,
      });

      if (data?.status === "complete") {
        // redirect to dashboard
        await setActive!({
          session: data.createdSessionId,
        });
        window.location.href = "/dashboard";
      }
    } catch (error: unknown) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }

    // if there's an error, set the error
  };

  return (
    <div className="w-[50%] p-4 bg-zinc-950 border rounded-sm py-12">
      <div className="space-y-2">
        <h1 className="font-bold text-2xl">Login </h1>
        <p className="text-muted-foreground">
          Welcome back! Login to your account 👋
        </p>
        <Separator className="bg-muted-foreground" />

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* First & Last Name */}
            {/* UserName */}
            <FormField
              control={form.control}
              name="email"
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
                  <div className="flex text-sm   justify-end items-center">
                    <Button
                      onClick={() => {
                        navigate("/auth/forgot-password");
                      }}
                      variant={"link"}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Sign Up */}
            <Button>
              <span>{isLoading ? "Loading" : "Sign In"}</span>
            </Button>
          </form>
        </Form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      {/* Sign In */}
      <div className="flex pr-4 items-center justify-end mt-4 gap-2">
        <p>Don't have an Account? </p>
        <button
          className="inline hover:text-zinc-300"
          onClick={() => navigate(appRoutes.auth.signUp)}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignIn;
