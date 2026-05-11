"use client";

import { CoinIcon, CoinSmIcon, CreditIcon, DebitIcon } from "@/Icons";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import {
  useGetWalletTransactions,
  WalletTransactionType,
} from "@/queries/Wallet";

type WalletSummary = {
  balance: number;
  totalIn: number;
  totalOut: number;
  transactions: WalletTransactionType[];
};

export default function Page() {
  const { userData } = useAppContext();
  const {
    data: walletData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetWalletTransactions(userData?.id);
  const summary = getWalletSummary(walletData);
  const hasWalletError = isError || walletData?.status === false;

  return (
    <CustomPageWrapper heading="Wallet">
      <div className="flex gap-10 max-[850px]:flex-col">
        <div className="flex-1">
          <div className="w-[455px] max-[500px]:w-full">
            <BalanceCard
              walletBalance={summary.balance}
              loading={isLoading}
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <SummaryCard label="Earned" value={summary.totalIn} type="in" />
              <SummaryCard label="Redeemed" value={summary.totalOut} type="out" />
            </div>

            <div className="mt-8 mb-2 flex items-center justify-between">
              <p className="text-gray-600 text-sm not-italic font-medium leading-5">
                Transaction History
              </p>
              {userData?.id && (
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="text-gradient text-xs not-italic font-semibold disabled:opacity-50"
                >
                  {isFetching && !isLoading ? "Refreshing..." : "Refresh"}
                </button>
              )}
            </div>

            <div className="sm-3 rounded-lg p-3 px-6 flex flex-col gap-4 bg-white">
              {!userData?.id ? (
                <EmptyState message="Login to view your wallet balance and transactions." />
              ) : isLoading ? (
                <TransactionSkeleton />
              ) : hasWalletError ? (
                <ErrorState onRetry={() => refetch()} />
              ) : summary.transactions.length ? (
                summary.transactions.map((transaction, index) => (
                  <div key={transaction.id || index} className="flex flex-col gap-2">
                    <TransactionCard transaction={transaction} />
                    {index < summary.transactions.length - 1 && (
                      <div className="w-full h-[1px] bg-gray-200"></div>
                    )}
                  </div>
                ))
              ) : (
                <EmptyState message="No wallet transactions yet." />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 max-[850px]:hidden">
          <img src="/assets/wallet/right.png" alt="wallet" className="w-full" />
        </div>
      </div>
    </CustomPageWrapper>
  );
}

const BalanceCard = ({
  walletBalance,
  loading,
}: {
  walletBalance: number;
  loading: boolean;
}) => {
  return (
    <div className="flex justify-between items-center linear-gradient-1 py-6 px-8 rounded-lg">
      <div>
        <p className="text-white text-xl not-italic font-semibold">
          Your Balance
        </p>
        <p className="text-white/80 text-xs not-italic font-normal mt-1">
          Bignlean Coins
        </p>
      </div>
      <div className="flex items-center gap-1">
        <CoinIcon />
        <p className="text-white text-4xl not-italic font-bold">
          {loading ? "--" : formatCoins(walletBalance)}
        </p>
      </div>
    </div>
  );
};

const SummaryCard = ({
  label,
  value,
  type,
}: {
  label: string;
  value: number;
  type: "in" | "out";
}) => {
  return (
    <div className="sm-3 rounded-lg bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs not-italic font-medium">{label}</p>
        {type === "in" ? <CreditIcon /> : <DebitIcon />}
      </div>
      <div className="mt-2 flex items-center gap-1">
        <CoinSmIcon />
        <p className="text-black text-lg not-italic font-bold">
          {formatCoins(value)}
        </p>
      </div>
    </div>
  );
};

const TransactionCard = ({
  transaction,
}: {
  transaction: WalletTransactionType;
}) => {
  const credit = transaction.type === "in";
  const value = Number(transaction.value || 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-1">
        <div className="min-w-0">
          <p className="text-black text-sm not-italic font-medium leading-5 truncate">
            {getTransactionLabel(transaction)}
          </p>
          <p className="text-gray-400 text-xs not-italic font-normal leading-5">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {credit ? <CreditIcon /> : <DebitIcon />}
          <CoinSmIcon />
          <p className="text-black text-right text-sm not-italic font-semibold leading-5">
            {formatCoins(value)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-500 text-xs not-italic font-normal leading-5 truncate">
          {getOrderLabel(transaction)}
        </p>
        <p
          className={`not-italic font-normal text-xs leading-5 shrink-0 ${
            credit ? "text-green-600" : "text-red-500"
          }`}
        >
          {credit ? "Credited" : "Redeemed"}
        </p>
      </div>
    </div>
  );
};

const TransactionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 rounded bg-gray-200"></div>
            <div className="h-4 w-16 rounded bg-gray-200"></div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="h-3 w-28 rounded bg-gray-100"></div>
            <div className="h-3 w-20 rounded bg-gray-100"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-8 text-center">
    <p className="text-gray-500 text-sm not-italic font-medium">{message}</p>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="py-8 text-center">
    <p className="text-red-500 text-sm not-italic font-medium">
      Unable to load wallet details.
    </p>
    <button onClick={onRetry} className="text-gradient text-sm font-semibold mt-2">
      Try again
    </button>
  </div>
);

function getWalletSummary(data: any): WalletSummary {
  const transactions = Array.isArray(data?.transactions)
    ? [...data.transactions].sort(
        (a, b) =>
          new Date(b?.createdAt || 0).getTime() -
          new Date(a?.createdAt || 0).getTime()
      )
    : [];
  const calculatedTotalIn = transactions.reduce(
    (sum, transaction) =>
      transaction.type === "in" ? sum + Number(transaction.value || 0) : sum,
    0
  );
  const calculatedTotalOut = transactions.reduce(
    (sum, transaction) =>
      transaction.type === "out" ? sum + Number(transaction.value || 0) : sum,
    0
  );
  const totalIn = Number(data?.totalIn ?? calculatedTotalIn);
  const totalOut = Number(data?.totalOut ?? calculatedTotalOut);
  const balance = Number(data?.total ?? data?.walletBalance ?? totalIn - totalOut);

  return {
    balance,
    totalIn,
    totalOut,
    transactions,
  };
}

function getTransactionLabel(transaction: WalletTransactionType) {
  if (transaction.title) return transaction.title;
  return transaction.type === "in"
    ? "Bignlean Coins credited"
    : "Bignlean Coins redeemed";
}

function getOrderLabel(transaction: WalletTransactionType) {
  if (transaction.order?.orderID) return `Order ${transaction.order.orderID}`;
  if (transaction.orderId) return `Order #${transaction.orderId}`;
  return transaction.type === "in" ? "Loyalty reward" : "Wallet redemption";
}

function formatCoins(value: number) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  return safeValue.toLocaleString("en-IN", {
    maximumFractionDigits: safeValue % 1 === 0 ? 0 : 2,
  });
}

function formatDate(dateString: string) {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
