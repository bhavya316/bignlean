import { ApiPaths } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

async function updateProfile(formData: any, userId: number) {
  if (userId) {
    return axios({
      method: "PUT",
      url: base_url + ApiPaths.USERS + "/" + userId,
      data: formData,
    });
  }
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (payload: { formData: any; userId: number }) =>
      updateProfile(payload?.formData, payload?.userId),
  });
}
