"use client";
import {
  AuthencityIcon,
  CertificateIcon,
  FaqIcon,
  MyOrderIcon,
  ReferIcon,
  ReviewsIcon,
  WalletIcon,
} from "@/Icons";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { logout } from "@/queries/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserType } from "@/utils/Types";
import { API_CONFIG } from "@/config/api";
import { getAuthHeaders, getAuthToken, persistAuthSession } from "@/utils/authSession";

type ProfileOption = {
  link: string;
  label: string;
  icon: ReactNode;
};
const profileOptions: ProfileOption[] = [
  { icon: <MyOrderIcon />, label: "My Orders", link: "/track-order" },
  { icon: <WalletIcon />, label: "Wallet", link: "/wallet" },
  { icon: <ReferIcon />, label: "Refer a Friend", link: "/refer-friend" },
  { icon: <ReviewsIcon />, label: "My Reviews", link: "/reviews" },
  { icon: <AuthencityIcon />, label: "Authenticity", link: "/authenticity" },
  { icon: <FaqIcon />, label: "FAQs", link: "/faq" },
  {
    icon: <CertificateIcon />,
    label: "Certificates",
    link: "/app-certificates",
  },
];

export default function Profile() {
  const { profileToggle, userData } = useAppContext();
  const dispatch = useDispatchContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Function to refresh user data if needed
  const refreshUserData = async () => {
    const userId = userData?.id || Cookies.get("userId");
    if (userId && profileToggle && (!userData?.email || !userData?.image)) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/user/${userId}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          console.error("User data fetch failed with status:", response.status);
          return;
        }

        const data = await response.json();

        if (data.status && data.user) {
          // Update context with complete user data
          dispatch({ type: "SET_USER_DATA", payload: data.user });

          persistAuthSession(data.user, getAuthToken() || undefined);
        } else {
          // If API doesn't return user, use Google data from cookies if available
          const userName = Cookies.get("userName");
          const userEmail = Cookies.get("userEmail");
          const userPhoto = Cookies.get("userPhoto");

          if (userName || userEmail || userPhoto) {
            const googleUserData: UserType = {
              name: userName || "",
              email: userEmail || "",
              image: null, // Use null instead of empty string to match UserType
              id: data?.user?.id || 0, // Provide a default of 0 to ensure it's always a number
              phone: data?.user?.phone || "",
              gender: data?.user?.gender || "",
              bglCash: data?.user?.bglCash || 0,
              dob: data?.user?.dob || "",
              height: data?.user?.height || 0,
              weight: data?.user?.weight || 0,
              referCode: data?.user?.referCode || ""
            };

            dispatch({ type: "SET_USER_DATA", payload: googleUserData });
            persistAuthSession(googleUserData, getAuthToken() || undefined);
          }
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Refresh user data when profile dropdown is opened
  useEffect(() => {
    if (profileToggle) {
      refreshUserData();
    }
  }, [profileToggle]);

  // Determine display name and avatar image
  const displayName = userData?.name || Cookies.get("userName") || "User";
  const avatarImage = userData?.image || Cookies.get("userPhoto") || "/assets/profile.jpg";

  return (
    <div className="relative">
      <div
        onClick={() =>
          dispatch({
            type: profileToggle ? "PROFILE_TOGGLE_OFF" : "PROFILE_TOGGLE_ON",
          })
        }
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={avatarImage}
          alt="avatar"
          className="object-cover object-center w-10 h-10 rounded-full"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/profile.jpg";
          }}
        />
        <p className="not-italic font-semibold whitespace-nowrap">
          {userData ? displayName : "Sign in"}
        </p>
      </div>
      {profileToggle && (
        <div
          onMouseLeave={() => dispatch({ type: "PROFILE_TOGGLE_OFF" })}
          className="absolute w-[320px] sm-1 top-full right-0 bg-white rounded-xl p-4 translate-y-2 z-[10000000]"
        >
          {userData && (
            <div
              onClick={() => router.push("/profile")}
              className="flex gap-4 items-center mb-5 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={userData?.image || "/assets/profile.jpg"}
                    alt="avatar"
                    className="object-fill w-12 h-12 rounded-full aspect-square"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/profile.jpg";
                    }}
                  />
                  <div>
                    <p className="text-gray-900 text-base not-italic font-semibold">
                      {userData?.name || "User Name"}
                    </p>
                    <p className="text-sm text-gray-900 opacity-70 not-italic font-normal">
                      {userData?.email || userData?.phone || ""}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex flex-col gap-5">
            {profileOptions.map((option, index) => (
              <Link
                key={index}
                className="flex items-center gap-3"
                href={option.link}
              >
                <span>{option.icon}</span>
                {option.label}
              </Link>
            ))}
          </div>
          {userData && (
            <button
              onClick={logout}
              className="mt-5 flex items-center gap-3 text-lg not-italic font-semibold text-gradient"
            >
              <span className="inline-block w-5"></span>
              Logout
            </button>
          )}
          {!userData && (
            <button
              onClick={() => router.push("/login")}
              className="mt-8 ml-5 text-lg not-italic font-semibold text-gradient"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </div>
  );
}
