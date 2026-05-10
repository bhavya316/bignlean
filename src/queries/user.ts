import { ApiPaths } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

async function updateUser(params: any) {
  return axios({
    method: "PUT",
    url: base_url + `/users/${params.id}`,
    data: { ...params },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: (params: any) => updateUser(params),
  });
}

export async function uploadPhoto(formData: any) {
  return axios({
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: base_url + ApiPaths.UPLOAD,
    data: formData,
  });
}

export function useUploadPhoto() {
  return useMutation({
    mutationFn: (formData) => uploadPhoto(formData),
  });
}
