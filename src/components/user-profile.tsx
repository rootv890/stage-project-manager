import { UserProfile } from "@clerk/clerk-react";

export function UserProfilePage() {
  return (
    <UserProfile
      appearance={{
        elements: {
          card: "bg-green dark:bg-green-900 shadow-lg", // Background of the modal
          headerTitle: "text-2xl text-gray-800 dark:text-white", // Title style
          formButtonPrimary: "bg-violet-600 hover:bg-violet-700 text-white", // Button style
          formFieldInput:
            "bg-gray-100 dark:bg-gray-800 text-black dark:text-white", // Input fields
          // Add other styles to match your theme...
        },
      }}
    />
  );
}
