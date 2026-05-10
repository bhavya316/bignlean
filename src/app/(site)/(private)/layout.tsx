"use client";
import AuthWrapper from "@/components/Wrappers/AuthWrapper";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
