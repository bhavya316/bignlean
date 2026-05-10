"use client";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { redirect } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const dispatch = useDispatchContext();
  useEffect(() => {
    if (!localStorage?.AUTH) redirect("/login");
    else if (localStorage?.AUTH) {
      dispatch({
        type: "SET_USER_DATA",
        payload: JSON.parse(localStorage?.AUTH),
      });
    }
  }, []);

  return <>{children}</>;
}
