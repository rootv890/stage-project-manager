import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Value } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

const CompeleteSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp } = useSignUp();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
    },
  });

  //   Submit
  const onSubmit = async (value: z.infer<typeof FormSchema>) => {
    console.log(value);
    // Update SSO Signup process
    setIsLoading(true);
    try {
      const attempt = await signUp?.update({
        firstName: value.firstName,
        lastName: value.lastName,
        username: value.username,
      });

      if (attempt?.status === "complete") {
        // TODO Toast :  Account Created
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[50%] p-4 bg-zinc-950 border rounded-sm py-12">
      <h1 className="text-2xl  text-center">Finish Your Account</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="chandler_1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-center gap-2 justify-between">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chandler" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Bing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading}>
            {isLoading ? "Loading..." : "Finish"}
          </Button>
        </form>
      </Form>

      {error && (
        <div className="mt-4 p-2 bg-red-500 text-white rounded-md">{error}</div>
      )}
    </div>
  );
};

export default CompeleteSignUp;
