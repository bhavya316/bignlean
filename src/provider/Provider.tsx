"use client";
import { ReactNode } from "react";
import ContextProvider from "./ContextProvider/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";

const queryClient = new QueryClient();

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <ContextProvider>{children}</ContextProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
