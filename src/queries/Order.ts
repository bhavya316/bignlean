"use client";
import { ApiPaths } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

async function getAllOrder(userId: number) {
  return axiosInstance({
    method: "GET",
    url: ApiPaths.ORDER_USER + "/" + userId,
  });
}

export function useGetAllOrder(userId: number) {
  return useQuery({
    queryKey: ["order", userId],
    queryFn: () => getAllOrder(userId),
    enabled: !!userId,
  });
}

// Update the cancelOrder function to use the orderId in the URL path

async function cancelOrder(orderId: number) {
  return axiosInstance({
    method: "DELETE",
    url: `${ApiPaths.CANCEL_ORDER}/${orderId}`,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
  });
}

export async function placeOrder(payload: {
  userid: number;
  addressid: number;
  paymentMethod: string;
  transactionId: string | null;
  bglCash: number;
  couponCode?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}) {
  return axiosInstance({
    method: "POST",
    url: ApiPaths.PLACE_ORDER,
    data: payload,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      userid: number;
      addressid: number;
      paymentMethod: string;
      transactionId: string | null;
      bglCash: number;
      couponCode?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    }) => placeOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
  });
}

// export function usePlaceOrder() {
//   const queryClient = useQueryClient();
//   const mutation = useMutation({
//     mutationFn: (payload: {
//       userid: number;
//       addressid: number;
//       paymentMethod: string;
//       transactionId: string | null;
//       bglCash: number;
//     }) => placeOrder(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["order"] });
//     },
//   });

//   // Add isLoading as an alias for isPending to maintain compatibility
//   return {
//     ...mutation,
//     isLoading: mutation.isPending
//   };
// }
