"use client";
import { CoinIcon, CoinSmIcon, CreditIcon, DebitIcon } from "@/Icons";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";

type TxsType = {
  id: number;
  user: {
    id: number;
    image: string;
    name: string;
    phone: string;
    email: string;
    gender: string;
    bglCash: number;
    dob: string;
    height: number | null;
    weight: number | null;
    referCode: string;
    otp: string;
    otpExpiry: string;
    firebaseUid: string | null;
    isBlocked: boolean;
    googleId: string | null;
    facebookId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  order: {
    id: number;
    user: number;
    product: number[];
    address: number;
    usedCoupon: boolean;
    coupon: number;
    couponDiscount: number;
    amount: number;
    qty: number[];
    paymentMethod: string;
    transactionId: string | null;
    usedBGLCash: boolean;
    bglCash: number;
    earnedBglCash: number;
    shiping: number;
    totalAmount: number;
    orderID: string;
    trackingID: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  title: string | null;
  type: string;
  value: number;
  createdAt: string;
};

type WalletApiResponse = {
  status: boolean;
  transactions: TxsType[];
  total: number; // Added total field for net balance
  totalIn: number;
  totalOut: number;
};

export default function page() {
  const { userData } = useAppContext();
  const [walletData, setWalletData] = useState<WalletApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.id) return;
    setLoading(true);
    axios
      .get(`${API_CONFIG.BASE_URL}/transactions?userId=${userData.id}`)
      .then((res) => setWalletData(res.data))
      .catch(() => setWalletData({ status: false, transactions: [], total: 0, totalIn: 0, totalOut: 0 }))
      .finally(() => setLoading(false));
  }, [userData?.id]);

  return (
    <CustomPageWrapper heading="Wallet">
      <div className="flex">
        <div className="flex-1 ">
          <div className="w-[455px] max-[500px]:w-full">
            <BalanceCard walletBalance={walletData?.total ?? 0} />
            <p className="text-gray-600 text-sm not-italic font-medium leading-5 mt-8 mb-2">
              Transaction History
            </p>
            <div className="sm-3 rounded-lg p-3 px-6 flex flex-col gap-4">
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : walletData?.transactions?.length ? (
                walletData.transactions.map((tran, index) => (
                  <div key={tran.id || index} className="flex flex-col gap-2">
                    <TransactionCard
                      credit={tran?.type === "in"}
                      status={tran?.type}
                      time={tran?.createdAt}
                      transLabel={tran?.order?.orderID || "Unknown Order"}
                      value={tran?.value}
                    />
                    {index < walletData.transactions.length - 1 && (
                      <div className="w-full h-[1px] bg-gray-200"></div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No transactions found.</p>
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

const BalanceCard = ({ walletBalance }: { walletBalance: number }) => {
  return (
    <div className="flex justify-between items-center linear-gradient-1 py-6 px-8 rounded-lg">
      <p className="text-white text-xl not-italic font-semibold">
        Your Balance
      </p>
      <div className="flex items-center gap-1">
        <CoinIcon />
        <p className="text-white text-4xl not-italic font-bold">
          {walletBalance}
        </p>
      </div>
    </div>
  );
};

const TransactionCard = ({
  credit,
  status,
  time,
  transLabel,
  value,
}: {
  transLabel: string;
  credit: boolean;
  value: number;
  status: string;
  time: string;
}) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Unknown Date";

      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      const day = date.getUTCDate();
      const month = months[date.getUTCMonth()];
      const year = date.getUTCFullYear();
      let hours = date.getUTCHours();
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format
      const ordinal = (day: number) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      };

      return `${day}${ordinal(day)} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    } catch {
      return "Unknown Date";
    }
  };

  const formattedTime = time ? formatDate(time) : "Unknown Date";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-black text-sm not-italic font-medium leading-5">
          {transLabel}
        </p>
        <div className="flex items-center gap-1">
          {credit ? <CreditIcon /> : <DebitIcon />}
          <CoinSmIcon />
          <p className="text-black text-right text-sm not-italic font-semibold leading-5">
            {value}.00
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs not-italic font-normal leading-5">
          {formattedTime}
        </p>
        <p
          className={`not-italic font-normal text-xs leading-5 ${
            status === "in" ? "text-green-600" : "text-red-500"
          }`}
        >
          {status === "in" ? "Transaction Successful" : "Redemption Successful"}
        </p>
      </div>
    </div>
  );
};
