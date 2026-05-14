"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { getAuthToken, persistAuthSession } from "@/utils/authSession";

const isMissing = (value?: string | null) => !String(value || "").trim();
const normalizeDateInput = (value?: string | null) =>
  String(value || "").slice(0, 10);
const isSyntheticSocialPhone = (value?: string | null) =>
  String(value || "").trim().toUpperCase().startsWith("SOCIAL-");
const getProfilePhoneValue = (value?: string | null) =>
  isSyntheticSocialPhone(value) ? "" : String(value || "");

const requiresProfileCompletion = (user: any) =>
  Boolean(user?.id) &&
  (
    isMissing(user?.name) ||
    isMissing(user?.email) ||
    isMissing(user?.phone) ||
    isSyntheticSocialPhone(user?.phone) ||
    isMissing(user?.dob) ||
    isMissing(user?.gender)
  );

export default function ProfileCompletionDialog() {
  const { userData } = useAppContext();
  const dispatch = useDispatchContext();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const shouldShow = useMemo(
    () => requiresProfileCompletion(userData),
    [userData]
  );

  useEffect(() => {
    if (!userData?.id) return;

    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: getProfilePhoneValue(userData.phone),
      dob: normalizeDateInput(userData.dob),
      gender: String(userData.gender || "").toLowerCase(),
    });
  }, [userData]);

  if (!shouldShow) return null;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const nextValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.replace(/\D/g, "").slice(-10),
      dob: formData.dob,
      gender: formData.gender,
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.dob ||
      !payload.gender
    ) {
      toast.error("Please complete all profile fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (payload.phone.length !== 10) {
      toast.error("Please enter a valid 10 digit phone number.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await axiosInstance.put(`/users/${userData?.id}`, payload);
      const updatedUser = response.data?.user;

      if (!response.data?.status || !updatedUser) {
        throw new Error(response.data?.message || "Unable to update profile.");
      }

      persistAuthSession(updatedUser, getAuthToken() || undefined);
      dispatch({ type: "SET_USER_DATA", payload: updatedUser });
      Cookies.set("phone", updatedUser.phone || payload.phone, {
        expires: 30,
        path: "/",
      });
      Cookies.set("userName", updatedUser.name || payload.name, {
        expires: 30,
        path: "/",
      });
      toast.success("Profile details saved.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-profile-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[520px] rounded-lg bg-white p-6 shadow-2xl max-[520px]:p-5"
      >
        <div className="mb-5">
          <h2
            id="complete-profile-title"
            className="text-xl font-semibold text-black"
          >
            Complete your profile
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add these details once to continue shopping smoothly.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
            Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="h-11 rounded-md border border-gray-200 px-3 text-sm text-black outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
              placeholder="Full name"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
            Phone number
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="h-11 rounded-md border border-gray-200 px-3 text-sm text-black outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
              placeholder="10 digit phone"
              maxLength={10}
              inputMode="numeric"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="h-11 rounded-md border border-gray-200 px-3 text-sm text-black outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
            Date of birth
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className="h-11 rounded-md border border-gray-200 px-3 text-sm text-black outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
              required
            />
          </label>

          <label className="col-span-2 flex flex-col gap-1.5 text-sm font-medium text-gray-700 max-[620px]:col-span-1">
            Gender
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-black outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 h-11 w-full rounded-md bg-red-700 px-4 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}
