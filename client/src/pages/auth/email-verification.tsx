import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export const EmailVerificationSchema = z.object({
  code: z.string(),
});

function EmailVerification({
  email = "email",
  handleCodeSubmit,
  error,
}: {
  email: string;
  error?: string;
  handleCodeSubmit: (value: z.infer<typeof EmailVerificationSchema>) => void;
}) {
  const form = useForm<z.infer<typeof EmailVerificationSchema>>({
    resolver: zodResolver(EmailVerificationSchema),
    defaultValues: {
      code: "",
    },
  });
  return (
    <div className="max-w-[50%] p-4 bg-zinc-950 py-12 w-full flex items-center justify-center flex-col">
      <div>
        <h1 className="text-2xl">Enter your Verification Code</h1>
        <p className="text-muted-foreground">
          We have sent code to your {email} . Paste it here
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCodeSubmit)}
            className="space-y-4 w-full "
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="mt-6 mb-2">
                  <FormControl>
                    <Input className="text-center" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="mx-auto flex">Submit</Button>
          </form>
        </Form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default EmailVerification;
