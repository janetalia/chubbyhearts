"use client";

import { Toaster } from "sonner";

export default function SonnerToaster() {
  return (
    <Toaster
      richColors
      position="bottom-right"
      toastOptions={{
        style: {
          borderRadius: "16px",
          borderColor: "#ede9e4",
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  );
}
