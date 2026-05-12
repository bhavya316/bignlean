"use client";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { AUTH_STORAGE_KEY, clearAuthSession } from "@/utils/authSession";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const dispatch = useDispatchContext();
  useEffect(() => {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!auth || auth === "null") redirect("/login");

    try {
      dispatch({
        type: "SET_USER_DATA",
        payload: JSON.parse(auth as string),
      });
    } catch {
      clearAuthSession();
      redirect("/login");
    }
  }, []);

  return <>{children}</>;
}
