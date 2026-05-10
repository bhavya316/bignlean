"use client";
import { ApiPaths } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

async function getAllAddresses(userId: number) {
  return axios({
    method: "GET",
    url: base_url + ApiPaths.ADDRESSES_USER + "/" + userId,
  });
}

export function useGetAllAddresses(userId: number) {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => getAllAddresses(userId),
    enabled: !!userId,
  });
}

async function addAddress(formData: any) {
  return axios({
    method: "POST",
    url: base_url + ApiPaths.ADDRESSES,
    data: formData,
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: any) => addAddress(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

async function updateAddress(formData: any, addressId: string) {
  return axios({
    method: "PUT",
    url: base_url + ApiPaths.ADDRESSES + "/" + addressId,
    data: formData,
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData, addressId }: any) =>
      updateAddress(formData, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

async function removeAddress(addressId: number) {
  return axios({
    method: "DELETE",
    url: base_url + ApiPaths.ADDRESSES + "/" + addressId,
  });
}

export function useRemoveAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: number) => removeAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
