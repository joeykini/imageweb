"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      isSatellite={false}
      appearance={{
        layout: {
          shimmer: false,
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorPrimary: '#0500ff',
        },
        elements: {
          formButtonPrimary: "bg-[#0500ff] hover:bg-[#0400dd]",
          footerActionLink: "text-[#0500ff] hover:text-[#0400dd]",
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
} 