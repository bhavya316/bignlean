import { ApiPaths } from "@/constants";
import { toast } from "react-toastify";
import { clearAuthSession } from "@/utils/authSession";

export async function loginUser(formData: any) {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + ApiPaths.USERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: formData,
  });
  return res;
}

export function logout() {
  if (typeof window !== "undefined") {
    clearAuthSession();
    toast.success("Logout successfully!!");
    window.location.replace("/login");
  }
}
