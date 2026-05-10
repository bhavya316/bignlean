import { LogoWrapper, RegisterForm } from "@/components";
import React, { Suspense } from "react";

export default function page() {
  return (
    <LogoWrapper>
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </LogoWrapper>
  );
}
