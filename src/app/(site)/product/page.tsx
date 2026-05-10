import { redirect } from "next/navigation";
export default function page() {
  redirect("/");
  return <div>You will be redirecting to.....</div>;
}
