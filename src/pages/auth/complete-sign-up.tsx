import { Button } from "@/components/ui/button";
import { useAuth, useSignUp } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormDataInput {
  username: string;
}

export const CompleteSignUp = () => {
  const { handleSubmit, register } = useForm<FormDataInput>();
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 2000);
  }

  const { isLoaded, signUp } = useSignUp();
  const navigate = useNavigate();
  const onSubmit = async (data: FormDataInput) => {
    if (!isLoaded || !signUp) return;

    try {
      // update the missing field
      await signUp.update({
        username: data.username,
      });

      // attempt to complete the process
      const signUpAttempt = await signUp.create({
        ...data,
      });

      // If the sign-up was completed, set the session to active
      if (signUpAttempt.status === "complete") {
        // Navigate to the homepage
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error) {
      console.error("Sign-up failed:", error);
    } finally {
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="flex mt-12 flex-col max-w-[512px] min-h-[calc(100vh-52px)] py-8 mx-auto justify-center text-foreground items-center">
      <section className="flex flex-col items-center justify-center bg-secondary/20 rounded-3xl gap-6 px-8 py-12 w-full backdrop-blur-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            {...register("username", { required: true })}
            placeholder="Enter your username"
            className="p-2 border rounded"
          />

          <Button type="submit" className="mt-4">
            Complete Sign Up
          </Button>
        </form>
      </section>
    </div>
  );
};
