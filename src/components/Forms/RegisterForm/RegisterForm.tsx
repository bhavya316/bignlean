"use client";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import InputField from "@/components/FormComponents/InputField";
import FormWrapper from "@/components/Wrappers/FormWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { signInWithGoogle } from "@/utils/firebaseConfig";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider"; // Add this import
import { API_CONFIG } from "@/config/api";
import { persistAuthSession } from "@/utils/authSession";

export default function RegisterForm() {
  const [phone, setPhone] = useState("");
  const [refferCode, setRefferCode] = useState("");
  const [disable, setDisable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const dispatch = useDispatchContext(); // Add this line
  const searchParams = useSearchParams();

  useEffect(() => {
    const referParam = searchParams?.get("refer");
    if (referParam) {
      setRefferCode(referParam);
    }
  }, [searchParams]);

  // Handle form submission for registration
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setDisable(true);
    // Clear previous error message
    setErrorMessage("");
    
    if (!phone || phone.length < 10) {
      toast.dismiss();
      toast.error("Please enter a valid mobile number");
      setDisable(false);
      return;
    }

    try {
      // Call the register API
      const response = await fetch(`${API_CONFIG.BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, referCode: refferCode || undefined }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      if (data.status) {
        // Check if user already exists based on the message
        const isExistingUser = data.message?.includes("User already exists");
        
        if (isExistingUser) {
          // For existing users - show the exact API message
          setErrorMessage(data.message || "User already exists.");
          console.log("Setting error message:", data.message);
          
          // Don't redirect for existing users
          setDisable(false);
        } else {
          // For new users - store data and redirect to verify OTP
          toast.dismiss();
          toast.success("OTP sent successfully to your mobile number!");
          
          // Store phone and referral code for new registration
          sessionStorage.setItem("tempUserPhone", phone);
          sessionStorage.setItem("tempReferCode", refferCode || "");
          sessionStorage.setItem("isRegistration", "true");
          
          // Only redirect to verify OTP for new users
          router.push("/verify-otp");
        }
      } else {
        // Handle refer code not found or other errors
        toast.dismiss();
        toast.error(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.dismiss();
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setDisable(false);
    }
  };
  const completeSocialSignIn = (data: any, provider: "google", firebaseUser: any) => {
    if (!data?.user || !data?.token) {
      toast.dismiss();
      toast.error("Authentication failed");
      return;
    }

    const userProfile = {
      ...data.user,
      provider,
      firebaseUid: firebaseUser?.uid || data.user.firebaseUid,
    };

    persistAuthSession(userProfile, data.token);
    dispatch({ type: "SET_USER_DATA", payload: userProfile });

    toast.dismiss();
    toast.success("Google sign-in successful!");
    window.location.href = "/";
  };

const handleGoogleSignIn = async () => {
  try {
    setDisable(true);
    setErrorMessage("");

    const { success, idToken, user, errorMessage } = await signInWithGoogle();
    
    if (!success || !idToken) {
      toast.dismiss();
      toast.error(errorMessage || "Google sign-in failed");
      setDisable(false);
      return;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
        provider: "google",
        name: user?.displayName || "",
        email: user?.email || "",
        image: user?.photoURL || ""
      }),
    });
    
    const data = await response.json();

    if (data.status) {
      completeSocialSignIn(data, "google", user);
    } else {
      toast.dismiss();
      toast.error(data.message || "Authentication failed");
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
    toast.dismiss();
    toast.error("Error during Google sign-in");
  } finally {
    setDisable(false);
  }
};
  return (
    <FormWrapper
      label="Register"
      link={{
        link: "/login",
        linkLabel: "Sign In",
        linkName: "Already have an account?",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[85%] mx-auto max-[550px]:w-[95%]"
      >
        {/* Display error message when user already exists */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold"></strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        
        <InputField
          type="mobile"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <InputField
          value={refferCode}
          onChange={(e) => setRefferCode(e.target.value)}
          type="text"
          placeholder="Referral Code"
        />
        <PrimaryButton
          type="submit"
          loading={disable}
          disable={disable || phone.length === 0}
          className="w-[80%] mx-auto max-[550px]:w-full"
          label="Send OTP"
        />
      </form>
      <div className="flex items-center justify-center mb-4 mt-4">
        <hr className="w-1/4 border-gray-300" />
        <span className="mx-2 text-gray-500">or</span>
        <hr className="w-1/4 border-gray-300" />
      </div>
      <div className="flex justify-center space-x-4">
        {/* Facebook login is disabled for now. */}
        {/* Google Icon */}
     <button
  onClick={handleGoogleSignIn}
  disabled={disable}
  className="w-[70px] h-[70px] md:w-[50px] md:h-[50px] sm:w-[40px] sm:h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition duration-200"
  style={{ boxShadow: '5px 4px 15px 0px #3333330D' }}
>
  {disable ? (
    <div className="h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
  ) : (
    <svg
      className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.34-1.36-.34-2.09s.12-1.43.34-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )}
</button>
      </div>
    </FormWrapper>
  );
}
