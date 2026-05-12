"use client";
import { useState, useEffect } from "react";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import FormWrapper from "@/components/Wrappers/FormWrapper";
import OTPInput from "react-otp-input";
import { toast } from "react-toastify";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API_CONFIG } from "@/config/api";
import { persistAuthSession } from "@/utils/authSession";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const dispatch = useDispatchContext();
  const router = useRouter();
  const [isFromRegistration, setIsFromRegistration] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Check if user has phone stored in session
  useEffect(() => {
    const storedPhone = sessionStorage.getItem("tempUserPhone");
    const isRegistration = sessionStorage.getItem("isRegistration") === "true";
    
    if (storedPhone) {
      setPhone(storedPhone);
      setIsFromRegistration(isRegistration);
    } else {
      router.push(isRegistration ? "/register" : "/login");
    }
  }, [router]);

const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (!phone || !otp || otp.length < 4) {
    toast.dismiss();
    toast.error("Please enter the complete 4-digit OTP");
    return;
  }
  
  setLoading(true);
  
  try {
    // Call the appropriate API based on whether this is registration or login
    const apiEndpoint = isFromRegistration
      ? `${API_CONFIG.BASE_URL}/verify-otp`
      : `${API_CONFIG.BASE_URL}/login`;
    
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.status) {
      toast.dismiss();
      toast.success("OTP verified successfully!");
      
      // Wait a moment, then show login success toast
      setTimeout(() => {
        toast.dismiss();
        toast.success(isFromRegistration ? "Registration completed successfully!" : "Login successful!");
      }, 800);
      
      // 1. Store user data in context
      dispatch({ type: "SET_USER_DATA", payload: data.user });
      
      // 2. Store complete user data and JWT in localStorage
      persistAuthSession(data.user, data.token);
      
      // 3. Store user ID in sessionStorage
      sessionStorage.setItem("userId", data.user.id.toString());
      
      // 4. Store user ID in cookie (30 days expiration)
      Cookies.set("userId", data.user.id.toString(), { expires: 30, path: "/" });
      
      // Store any other important user info in cookies
      Cookies.set("phone", data.user.phone, { expires: 30, path: "/" });
      Cookies.set("userName", data.user.name || "", { expires: 30, path: "/" });
      
      // Log storage confirmation
      console.log("User data stored in localStorage, sessionStorage, and cookies");
      
      // Clear registration/login flow data
      sessionStorage.removeItem("tempUserPhone");
      sessionStorage.removeItem("tempReferCode");
      sessionStorage.removeItem("isRegistration");
      
      // Add a longer delay before navigation to allow both toasts to display
      setTimeout(() => {
        // Redirect to home for both first-time registration and login
        router.push("/");
      }, 2500); // 2.5 seconds delay to show both toasts
    } else {
      toast.dismiss();
      toast.error(data.message || "Invalid OTP. Please try again.");
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    toast.dismiss();
    toast.error("Failed to verify OTP. Please try again.");
  } finally {
    setLoading(false);
  }
};
  
  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend || resending) return;
    
    if (!phone) {
      toast.dismiss();
      toast.error("Phone number not found. Please try again.");
      router.push(isFromRegistration ? "/register" : "/login");
      return;
    }

    try {
      setResending(true);

      const response = await fetch(`${API_CONFIG.BASE_URL}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.status) {
        toast.dismiss();
        toast.success("OTP resent successfully to your mobile number!");
        setOtp("");
        setCountdown(60);
        setCanResend(false);
      } else {
        toast.dismiss();
        toast.error(data?.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.dismiss();
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <FormWrapper label={isFromRegistration ? "Register" : "Login"} privacy={true}>
      <div>
        <h3 className="text-gray-500 text-center text-sm not-italic font-normal">
          We have sent an OTP to the Number
        </h3>
        <p className="text-black text-center text-sm not-italic font-normal">
          {phone ? `+91 ${phone}` : "+91 77385 46983"}
        </p>
      </div>
      <form 
        onSubmit={handleVerifyOtp}
        className="flex flex-col gap-[22px] w-[85%] mx-auto mt-[28px]"
      >
        <OTPInput
          containerStyle={{
            justifyContent: "center",
            gap: "clamp(10px, 4vw, 18px)",
            width: "100%",
          }}
          value={otp}
          onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 4))}
          numInputs={4}
          inputType="tel"
          renderInput={(props) => (
            <input
              {...props}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              className="!h-14 !w-14 max-[380px]:!h-12 max-[380px]:!w-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-semibold text-black outline-none shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          )}
        />
        <PrimaryButton
          className="w-[305px] mx-auto mt-[22px] max-[550px]:w-full"
          type="submit"
          label="Verify OTP"
          loading={loading}
        />
      </form>
      <p className="text-gray-500 text-center text-sm not-italic font-normal mt-5">
        Resend OTP:
        <span
          className={`ml-1 ${canResend && !resending ? 'text-red-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
          onClick={handleResendOtp}
        >
          {resending ? 'Sending...' : canResend ? 'Resend Now' : `${countdown}s`}
        </span>
      </p>
    </FormWrapper>
  );
}
