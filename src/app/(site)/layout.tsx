"use client";
import { Footer, NavBar, SecondaryNavbar } from "@/components";
import MobileFooter from "@/components/Footer/MobileFooter";
import BreadCrumbs from "@/components/breadcrumbs/BreadCrumbs";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { ReactNode, useEffect, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AUTH_STORAGE_KEY, clearAuthSession } from "@/utils/authSession";

export default function Layout({ children }: { children: ReactNode }) {
  const dispatch = useDispatchContext();

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (auth && auth !== "null") {
      try {
      dispatch({
        type: "SET_USER_DATA",
        payload: JSON.parse(auth),
      });
      } catch {
        clearAuthSession();
      }
    }
  }, []);

  useEffect(() => {
    const func = () => {
      dispatch({ type: "SET_SLIDE_PER_VIEW", payload: window.innerWidth });
    };
    func();
    window.addEventListener("resize", func);

    return () => window.removeEventListener("resize", func);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <ToastContainer position="top-right" style={{ top: "88px" }} />
      <NavBar />
      <SecondaryNavbar />
      <Suspense fallback={null}>
        <BreadCrumbs />
      </Suspense>
      <div className=" ">{children}</div>
      <Footer />
      <MobileFooter />
    </div>
  );
}
