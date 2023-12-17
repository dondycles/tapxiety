// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider
      className={`dark bg-background w-full h-screen max-h-[100dvh] p-4 text-foreground text-xs sm-text-sm bg-gradient-to-b from-background to-primary/10 ${montserrat.className}`}
    >
      {children}
    </NextUIProvider>
  );
}
