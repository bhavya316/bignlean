"use client";
import { ApiPaths } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

async function getWishList(userId: number) {
  const data = await axiosInstance({
    method: "GET",
    url: ApiPaths.WISHLIST + `/${userId}`,
  });
  return data.data;
}

export function useGEtWishList(userId: number) {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishList(userId),
    enabled: !!userId,
  });
}

async function addToWishList(productId: number, userId: number, isCombo?: boolean) {
  return axiosInstance({
    method: "POST",
    url: ApiPaths.FAVORITES,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    data: { user: userId, product: productId, isCombo: isCombo || false },
  });
}

export function useAddToWishList() {
  return useMutation({
    mutationFn: (data: { productId: number; userId: number; isCombo?: boolean }) =>
      addToWishList(data?.productId, data?.userId, data?.isCombo),
  });
}

async function removeFromWishList(productId: number, userId: number, isCombo?: boolean) {
  return axiosInstance({
    method: "DELETE",
    url: ApiPaths.WISHLIST + "/" + userId + "/product/" + productId,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    params: { isCombo: isCombo || false },
  });
}

export function useRemoveFormWishList() {
  return useMutation({
    mutationFn: (data: { productId: number; userId: number; isCombo?: boolean }) =>
      removeFromWishList(data?.productId, data?.userId, data?.isCombo),
  });
}
async function getCouponsList() {
  return axiosInstance({
    method: "GET",
    url: "/admin/coupons",
  });
}

export function useGEtCouponsList() {
  return useQuery({
    queryKey: ["Coupons-list"],
    queryFn: () => getCouponsList(),
    refetchOnWindowFocus: false,
  });
}
async function getPinCodeAvailability(input: string, productPrice: number) {
  return axiosInstance({
    method: "GET",
    url: `/pinServiceability?input=${input}&productPrice=${productPrice}`,
  });
}
export function useGEtPinCodeAvailability() {
  return useMutation({
    mutationFn: ({
      input,
      productPrice,
    }: {
      input: string;
      productPrice: number;
    }) => getPinCodeAvailability(input, productPrice),
  });
}

async function getShippingServiceability(payload: {
  origin: string;
  destination: string;
  payment_type: string;
  order_amount: number;
  weight: number;
}) {
  return axiosInstance({
    method: "POST",
    url: "/admin/shipping/serviceability",
    data: payload,
  });
}

export function useGetShippingServiceability() {
  return useMutation({
    mutationFn: (payload: {
      origin: string;
      destination: string;
      payment_type: string;
      order_amount: number;
      weight: number;
    }) => getShippingServiceability(payload),
  });
}

async function createShipment(shipmentData: any) {
  return axiosInstance({
    method: "POST",
    url: "/admin/shipping/create-shipment",
    data: shipmentData,
  });
}

export function useCreateShipment() {
  return useMutation({
    mutationFn: (shipmentData: any) => createShipment(shipmentData),
  });
}
