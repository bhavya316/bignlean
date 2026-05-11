"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export type WalletTransactionType = {
  id: number;
  user?: unknown;
  order?: {
    id?: number;
    orderID?: string | null;
    totalAmount?: number;
    status?: string;
    createdAt?: string;
  } | null;
  orderId?: number;
  title?: string | null;
  type: "in" | "out" | string;
  value: number;
  createdAt: string;
  updatedAt?: string;
};

export type WalletApiResponse = {
  status: boolean;
  transactions: WalletTransactionType[];
  total?: number;
  walletBalance?: number;
  baseBglCash?: number;
  transactionTotalIn?: number;
  totalIn?: number;
  totalOut?: number;
  message?: string;
};

async function getWalletTransactions(userId: number) {
  const { data } = await axiosInstance.get<WalletApiResponse>("/transactions", {
    params: { userId },
  });

  return data;
}

export function useGetWalletTransactions(userId: number | undefined) {
  return useQuery({
    queryKey: ["wallet-transactions", userId],
    queryFn: () => getWalletTransactions(userId as number),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}
