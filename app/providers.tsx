// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="dark bg-background w-full h-screen max-h-[100dvh] p-4 text-foreground text-xs sm-text-sm">
      {children}
    </NextUIProvider>
  );
}
