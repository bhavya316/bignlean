"use client";
import { ReactNode } from "react";
import { useEffect } from "react";
import ContextProvider from "./ContextProvider/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { configureAxiosAuth } from "@/lib/axios";

const queryClient = new QueryClient();

export default function Provider({ children }: { children: ReactNode }) {
  useEffect(() => {
    configureAxiosAuth();
  }, []);

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <ContextProvider>{children}</ContextProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
