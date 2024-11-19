export const appRoutes = {
  home: "/" as const,
  dashboard: {
    index: "/dashboard" as const,
  },
  auth: {
    index: "/auth" as const,
    signIn: "/auth/sign-in" as const,
    signUp: "/auth/sign-up" as const,
    signOut: "/auth/sign-out" as const,
    forgotPassword: "/auth/forgot-password" as const,
    ssoCallback: "/auth/sso-callback" as const,
    complete: "/auth/complete" as const,
  },
} as const;
