"use client";
import { ApiPaths } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

async function getWishList(userId: number) {
  const data = await axios({
    method: "GET",
    url: base_url + ApiPaths.WISHLIST + `/${userId}`,
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

async function addToWishList(productId: number, userId: number) {
  return axios({
    method: "POST",
    url: base_url + ApiPaths.FAVORITES,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    data: JSON.stringify({ user: userId, product: productId }),
  });
}

export function useAddToWishList() {
  return useMutation({
    mutationFn: (data: { productId: number; userId: number }) =>
      addToWishList(data?.productId, data?.userId),
  });
}

async function removeFromWishList(productId: number, userId: number) {
  return axios({
    method: "DELETE",
    url: base_url + ApiPaths.WISHLIST + "/" + userId + "/product/" + productId,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function useRemoveFormWishList() {
  return useMutation({
    mutationFn: (data: { productId: number; userId: number }) =>
      removeFromWishList(data?.productId, data?.userId),
  });
}
async function getCouponsList() {
  return axios({
    method: "GET",
    url: base_url + "/admin/coupons",
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
  return axios({
    method: "GET",
    url:
      base_url +
      `/pinServiceability?input=${input}&productPrice=${productPrice}`,
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
  return axios({
    method: "POST",
    url: `${base_url}/admin/shipping/serviceability`,
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
  return axios({
    method: "POST",
    url: `${base_url}/admin/shipping/create-shipment`,
    data: shipmentData,
  });
}

export function useCreateShipment() {
  return useMutation({
    mutationFn: (shipmentData: any) => createShipment(shipmentData),
  });
}
