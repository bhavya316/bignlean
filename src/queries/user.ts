import { ApiPaths } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

async function updateUser(params: any) {
  return axiosInstance({
    method: "PUT",
    url: `/users/${params.id}`,
    data: { ...params },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: (params: any) => updateUser(params),
  });
}

export async function uploadPhoto(formData: any) {
  return axiosInstance({
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: ApiPaths.UPLOAD,
    data: formData,
  });
}

export function useUploadPhoto() {
  return useMutation({
    mutationFn: (formData) => uploadPhoto(formData),
  });
}
