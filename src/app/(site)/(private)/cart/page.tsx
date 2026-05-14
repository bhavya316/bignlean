"use client";
import { CoinSmIcon, Info2Icon } from "@/Icons";
import { CartProducts, SuggestedProduct } from "@/components";
import ApplyCouponCard from "@/components/ApplyCouponCard/ApplyCouponCard";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import ShippingCard from "@/components/ShippingCard/ShippingCard";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { makePayment } from "@/queries/razor";
import { useGetCartList, useGetCartPrice } from "@/queries/Cart";
import { useGetShippingServiceability } from "@/queries/Product";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import Loader from "@/components/Loader/Loader";
import { usePlaceOrder } from "@/queries/Order";
import { useRouter } from "next/navigation";
import { RazorPayIcon } from "@/Icons/RazorPayIcon";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { toast } from "react-toastify";
import {
  useGetWalletTransactions,
  type WalletApiResponse,
} from "@/queries/Wallet";

export default function Page() {
  const { userData } = useAppContext();
  const router = useRouter();

  const [addressErr, setAddressErr] = useState<boolean>(false);
  const [payErr, setPayErr] = useState<boolean>(false);
  const [addressId, setAddressId] = useState<any>(null);
  const [bnlCash, setBnlCash] = useState<number>(0);
  const [couponId, setCouponIdState] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("bignlean_applied_coupon");
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [cartParams, setCartParams] = useState({
    user: userData?.id,
    coupon: couponId,
    addressId: addressId,
  });

  // Get cart data
  const {
    data: cartList,
    isLoading,
    refetch: refetchCart,
  } = useGetCartList(userData?.id as number);
  const { data: cartPrice, refetch: refetchCartPrice } =
    useGetCartPrice(cartParams);
  const {
    data: walletData,
    isLoading: isWalletLoading,
    isError: isWalletError,
  } = useGetWalletTransactions(userData?.id);
  const walletBalance = getWalletBalance(walletData);

  const [paymentMethod, setPaymentMethod] = useState("");

  const setCouponId = useCallback((coupon: string | null) => {
    setCouponIdState(coupon);
    if (typeof window === "undefined") return;
    if (coupon) {
      sessionStorage.setItem("bignlean_applied_coupon", coupon);
    } else {
      sessionStorage.removeItem("bignlean_applied_coupon");
    }
  }, []);

  const handleOptionChange = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  const {
    mutate: placeAnOrder,
    isPending: isOrderLoading,
  } = usePlaceOrder();

  const { mutate: checkServiceability } = useGetShippingServiceability();

  const handleAddressSelect = (address: any) => {
    setAddressId(address?.id);
    const total = effectiveCartPrice?.totalAmount || 0;

    const loadingToast = toast.loading("Checking delivery availability...");

    // Map payment method to API expected values, default to prepaid if not selected
    const paymentType = paymentMethod === "COD" ? "cod" : "prepaid";

    const payload = {
      origin: "421204", // Hardcoded origin as per requirement
      destination: address?.pincode,
      payment_type: paymentType,
      order_amount: total,
      weight: 500, // Default weight as per requirement
    };

    checkServiceability(payload, {
      onSuccess: (res: any) => {
        toast.dismiss(loadingToast);
        if (res?.data?.status && res?.data?.data?.length > 0) {
          toast.success("Delivery service available for this location");
        } else {
          toast.error("Delivery not available for this location");
          // setAddressId(null); // Optional: Reset address if not serviceable
        }
      },
      onError: (err: any) => {
        toast.dismiss(loadingToast);
        console.error("Serviceability check error:", err);
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Error checking delivery availability";
        toast.error(errorMsg);
      },
    });
  };

  // Calculate cart price manually from cart items
  const calculateCartPrice = useCallback(() => {
    if (!cartList?.data?.cartItems?.length) return null;

    try {
      let totalAmount = 0;
      let discount = 0;

      cartList.data.cartItems.forEach((item: any) => {
        const qty = Number(item.qty) || 0;
        const sellingPrice = Number(item.sellingPrice) || 0;
        const mrp = Number(item.mrp) || 0;

        const itemTotal = qty * sellingPrice;
        const itemDiscount = qty * (mrp - sellingPrice);

        totalAmount += itemTotal;
        discount += itemDiscount;
      });

      const safeCash = getSafeWalletCash(bnlCash, walletBalance, {
        status: true,
        totalAmount,
        shiping: 40,
        discount,
        couponDiscount: 0,
        canUseBGLCash: totalAmount >= 3000 && walletBalance >= 500,
        afterUseBGLCash: totalAmount,
        isPremium: false,
      });

      return {
        status: true,
        totalAmount: totalAmount,
        shiping: 40,
        discount: discount,
        couponDiscount: 0,
        canUseBGLCash: totalAmount >= 3000 && walletBalance >= 500,
        afterUseBGLCash: Math.max(0, totalAmount - safeCash),
        isPremium: false,
      };
    } catch (error) {
      console.error("Error calculating cart price:", error);
      return null;
    }
  }, [cartList?.data?.cartItems, bnlCash, walletBalance]);

  // Use API price data or fallback to calculated price
  const effectiveCartPrice = useMemo(() => {
    if (cartPrice?.data?.status === true) {
      return cartPrice.data;
    }
    return calculateCartPrice();
  }, [cartPrice?.data, calculateCartPrice]);

  // Handle retrying price data load
  const retryLoadCartPrice = () => {
    refetchCartPrice();
    toast.success("Refreshing cart price...");
  };

  // Update cart parameters when dependencies change
  useEffect(() => {
    if (userData?.id) {
      setCartParams({
        user: userData.id,
        coupon: couponId,
        addressId: addressId,
      });
    }
  }, [couponId, addressId, userData?.id]);

  // Handle order placement
  const orderHandler = async () => {
    try {
      setIsPlacingOrder(true);

      if (!userData?.id) {
        toast.error("Please log in to place an order");
        setIsPlacingOrder(false);
        return;
      }

      if (!addressId) {
        setAddressErr(true);
        toast.error("Please select a delivery address");
        setIsPlacingOrder(false);
        return;
      }

      if (!paymentMethod) {
        setPayErr(true);
        toast.error("Please select a payment method");
        setIsPlacingOrder(false);
        return;
      }

      if (!effectiveCartPrice) {
        toast.error("Unable to calculate order amount. Please try again.");
        setIsPlacingOrder(false);
        return;
      }

      setAddressErr(false);
      setPayErr(false);

      if (bnlCash > 0 && isWalletLoading) {
        toast.error("Please wait while wallet balance is checked");
        setIsPlacingOrder(false);
        return;
      }

      if (bnlCash > 0 && isWalletError) {
        toast.error("Unable to verify wallet balance. Please try again.");
        setIsPlacingOrder(false);
        return;
      }

      const safeBnlCash = getSafeWalletCash(
        bnlCash,
        walletBalance,
        effectiveCartPrice
      );
      if (bnlCash > safeBnlCash) {
        setBnlCash(safeBnlCash);
        toast.info(
          safeBnlCash > 0
            ? `Wallet redemption adjusted to ₹${safeBnlCash}`
            : "Wallet redemption removed because it is not eligible"
        );
      }

      const payload = {
        userid: Number(userData.id),
        addressid: Number(addressId),
        couponCode: couponId || undefined,
        paymentMethod: paymentMethod,
        transactionId: paymentMethod === "COD" ? null : "pending-" + Date.now(),
        bglCash: safeBnlCash,
      };

      console.log("Order payload:", payload);

      if (paymentMethod === "RazorPay") {
        const totalAmount = effectiveCartPrice.totalAmount || 0;
        const shipping = effectiveCartPrice.shiping || 0;
        const amount = Math.max(
          0,
          Math.round((totalAmount + shipping - safeBnlCash) * 100)
        );

        if (amount <= 0) {
          toast.error(
            "Order amount must be greater than zero for online payment"
          );
          setIsPlacingOrder(false);
          return;
        }

        const loadingToast = toast.loading("Opening Razorpay...");
        try {
          await makePayment({ payload, amount });
          toast.success("Order placed. Please wait for admin confirmation.");
          setCouponId(null);
          setTimeout(() => {
            router.push("/track-order");
          }, 1000);
        } finally {
          toast.dismiss(loadingToast);
          setIsPlacingOrder(false);
        }
      } else if (paymentMethod === "COD") {
        const loadingToast = toast.loading("Processing your order...");
        placeAnOrder(payload, {
          onSuccess: (data) => {
            toast.dismiss(loadingToast);
            toast.success(data?.data?.message || "Order placed. Please wait for admin confirmation.");
            setCouponId(null);
            setIsPlacingOrder(false);
            setTimeout(() => {
              router.push("/track-order");
            }, 1000);
          },
          onError: (error: any) => {
            toast.dismiss(loadingToast);
            let errorMessage = "Failed to place order. Please try again.";
            if (typeof error?.message === "string") {
              errorMessage = error.message;
            } else if (error?.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error?.data?.message) {
              errorMessage = error.data.message;
            }
            toast.error(errorMessage);
            console.error("Order placement error:", error);
            setIsPlacingOrder(false);
          },
        });
      }
    } catch (error: any) {
      console.error("Order handler error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
      setIsPlacingOrder(false);
    }
  };

  // Clear errors when fields are filled
  useEffect(() => {
    if (addressId) setAddressErr(false);
    if (paymentMethod) setPayErr(false);
  }, [addressId, paymentMethod]);

  if (isLoading) {
    return <Loader />;
  }

  const similarProducts = cartList?.data?.semilerProduct || [];

  const totalAmount = effectiveCartPrice?.totalAmount || 0;
  const shipping = effectiveCartPrice?.shiping || 0;
  const safeBnlCash = getSafeWalletCash(
    bnlCash,
    walletBalance,
    effectiveCartPrice
  );
  const finalAmount = Math.max(0, totalAmount + shipping - safeBnlCash);

  return (
    <CustomPageWrapper heading="Cart">
      {cartList?.data?.cartItems?.length > 0 ? (
        <>
          <SavingBanner totalSavings={effectiveCartPrice?.discount} />
          <div className="flex gap-[22px] mt-6 max-[800px]:flex-col">
            <div className="flex-[0.6] flex flex-col gap-5 max-[800px]:gap-5">
              <CartProducts data={cartList?.data?.cartItems || []} />
              <SuggestedProduct similarProducts={similarProducts} />
            </div>
            <div className="flex-[0.4] flex flex-col gap-4">
              <SpareCashCard
                setBnlCash={setBnlCash}
                bnlCash={safeBnlCash}
                cartPrice={effectiveCartPrice}
                walletBalance={walletBalance}
                isLoading={isWalletLoading}
                error={isWalletError ? "Failed to load wallet balance" : null}
              />
              <ApplyCouponCard
                setCouponId={setCouponId}
                appliedCoupon={couponId}
              />
              <OrderCard
                bnlCash={safeBnlCash}
                cartPrice={effectiveCartPrice}
                onRetry={retryLoadCartPrice}
              />
              <div className="bg-white rounded-lg p-6 w-full sm-1">
                <form className="space-y-2">
                  <h2 className="text-black text-base flex items-center justify-between w-full not-italic font-semibold leading-4 mb-[22px]">
                    Payment Method{" "}
                    <span className="text-red-600">
                      {payErr && "Select a payment method"}
                    </span>
                  </h2>
                  <div className="flex cursor-pointer w-fit items-center gap-2">
                    <input
                      type="radio"
                      id="razorpay"
                      value="RazorPay"
                      checked={paymentMethod === "RazorPay"}
                      onChange={handleOptionChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="razorpay"
                      className="text-sm cursor-pointer font-medium text-gray-700"
                    >
                      <RazorPayIcon />
                    </label>
                  </div>
                  <div className="flex cursor-pointer w-fit items-center gap-2">
                    <input
                      type="radio"
                      id="cod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={handleOptionChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="cod"
                      className="text-lg font-extrabold cursor-pointer italic text-[#072654]"
                    >
                      Cash on Delivery
                    </label>
                  </div>
                </form>
              </div>
              <ShippingCard
                err={addressErr}
                onAddressSelect={handleAddressSelect}
              />
              <div
                className="flex justify-between items-center 
                fixed bottom-0 left-0 w-full z-[999999] 
                bg-white rounded-lg p-4 
                lg:relative lg:bottom-auto lg:left-auto lg:w-auto lg:z-auto"
              >
                <div>
                  <p className="text-black text-lg font-bold">
                    ₹{finalAmount.toFixed(2)}
                  </p>
                  <p className="text-black text-sm font-normal">Total Amount</p>
                </div>
                <PrimaryButton
                  onClick={orderHandler}
                  label={
                    isPlacingOrder ? "Processing..." : "Process to Checkout"
                  }
                  disable={isPlacingOrder || isOrderLoading}
                  className="w-[210px] h-[44px] text-sm font-normal"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center flex flex-col items-center justify-center">
          <img
            src="/assets/Cart NotFound.png"
            alt="Empty Cart"
            className="w-[350px] h-auto object-contain"
          />
          <p className="text-gray-600 text-xl font-medium mb-6">Your cart is empty</p>
          <PrimaryButton
            onClick={() => router.push("/")}
            label="Continue Shopping"
            className="mx-auto"
          />
        </div>
      )}
    </CustomPageWrapper>
  );
}

function getWalletBalance(walletData: WalletApiResponse | undefined) {
  const transactions = Array.isArray(walletData?.transactions)
    ? walletData.transactions
    : [];

  const calculatedBalance = transactions.reduce((total, transaction) => {
    const value = Number(transaction.value) || 0;

    if (transaction.type === "in") return total + value;
    if (transaction.type === "out") return total - value;
    return total;
  }, 0);

  const balance = Number(
    walletData?.total ?? walletData?.walletBalance ?? calculatedBalance
  );

  return Math.max(0, Math.floor(Number.isFinite(balance) ? balance : 0));
}

function getSafeWalletCash(
  requestedCash: number,
  walletBalance: number,
  cartPrice: CarttPrice | null | undefined
) {
  const requested = Math.max(0, Math.floor(Number(requestedCash) || 0));
  const available = Math.max(0, Math.floor(Number(walletBalance) || 0));
  const cartAmount = Math.max(0, Number(cartPrice?.totalAmount || 0));

  if (requested <= 0 || cartAmount < 3000 || available < 500) return 0;

  return Math.min(requested, available, cartAmount);
}

const SavingBanner = ({
  totalSavings,
}: {
  totalSavings: number | undefined;
}) => {
  if (!totalSavings || totalSavings <= 0) return null;

  return (
    <p className="bg-green-500 w-full text-center text-white text-xs py-3 not-italic font-medium">
      You are saving{" "}
      <span className="text-white text-xs not-italic font-semibold">
        ₹{totalSavings.toFixed(2)}
      </span>{" "}
      on this purchase
    </p>
  );
};

const SpareCashCard = ({
  setBnlCash,
  bnlCash,
  cartPrice,
  walletBalance,
  isLoading,
  error,
}: {
  setBnlCash: React.Dispatch<React.SetStateAction<number>>;
  bnlCash: number;
  cartPrice: CarttPrice | null | undefined;
  walletBalance: number;
  isLoading: boolean;
  error: string | null;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [eligibilityMsg, setEligibilityMsg] = useState<string | null>(null);

  // React to eligibility changes: reset applied cash if user becomes ineligible
  useEffect(() => {
    const cartAmount = Number(cartPrice?.totalAmount || 0);
    const isCartEligible = cartAmount >= 3000;
    const hasMinCoins = walletBalance >= 500;

    if (!isCartEligible && !isLoading) {
      setEligibilityMsg("Cart must be at least ₹3,000 to redeem coins");
    } else if (!hasMinCoins && !isLoading) {
      setEligibilityMsg("Minimum 500 Bignlean Coins required to redeem");
    } else {
      setEligibilityMsg(null);
    }

    if (bnlCash > 0 && (!isCartEligible || !hasMinCoins)) {
      setBnlCash(0);
      if (!isLoading) {
        toast.error("Loyalty cash removed: redemption not eligible currently");
      }
    } else if (bnlCash > walletBalance) {
      const safeCash = getSafeWalletCash(bnlCash, walletBalance, cartPrice);
      setBnlCash(safeCash);
      if (!isLoading) {
        toast.error(`Wallet redemption cannot exceed ₹${walletBalance}`);
      }
    }
  }, [cartPrice?.totalAmount, walletBalance, isLoading, bnlCash, setBnlCash]);

  const handleDialogOpen = () => {
    const cartAmount = Number(cartPrice?.totalAmount || 0);
    const isCartEligible = cartAmount >= 3000;
    const hasMinCoins = walletBalance >= 500;

    if (!isCartEligible) {
      toast.error("Cart must be at least ₹3,000 to redeem coins");
      return;
    }
    if (!hasMinCoins) {
      toast.error("Minimum 500 Bignlean Coins required to redeem");
      return;
    }

    setInputValue(bnlCash > 0 ? bnlCash.toString() : "");
    setIsDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    const value = Number(inputValue);
    const cartAmount = Number(cartPrice?.totalAmount || 0);
    const maxRedeemable = Math.max(0, cartAmount);
    const isCartEligible = cartAmount >= 3000;
    const hasMinCoins = walletBalance >= 500;

    // Check if input is empty
    if (!inputValue || inputValue.trim() === "") {
      toast.error("Please enter an amount");
      return;
    }

    // Check if input is a valid number
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    // Check if amount is negative
    if (value < 0) {
      toast.error("Amount cannot be negative");
      return;
    }

    // Check if amount is zero
    if (value === 0) {
      toast.error("Please enter an amount greater than 0");
      return;
    }

    // Eligibility checks
    if (!isCartEligible) {
      toast.error("Cart must be at least ₹3,000 to redeem coins");
      return;
    }
    if (!hasMinCoins) {
      toast.error("Minimum 500 Bignlean Coins required to redeem");
      return;
    }

    // Check if amount exceeds balance
    if (value > walletBalance) {
      toast.error(`Insufficient balance! You only have ₹${walletBalance} available.`);
      return;
    }

    // Cannot exceed maximum redeemable based on cart amount minus coupon
    if (value > maxRedeemable) {
      toast.error(`You can redeem up to ₹${maxRedeemable} on this order`);
      return;
    }

    // Check if amount has decimal places
    if (value % 1 !== 0) {
      toast.error("Please enter a whole number (no decimals)");
      return;
    }

    setBnlCash(value);
    setIsDialogOpen(false);
    toast.success(`Using ₹${value} Bignlean cash`);
  };

  const handleDialogCancel = () => {
    setBnlCash(0);
    setInputValue("");
    setIsDialogOpen(false);
  };

  const getInputError = () => {
    if (!inputValue || inputValue.trim() === "") return null;

    const value = Number(inputValue);
    const cartAmount = Number(cartPrice?.totalAmount || 0);
    const maxRedeemable = Math.max(0, cartAmount);
    const isCartEligible = cartAmount >= 3000;
    const hasMinCoins = walletBalance >= 500;

    if (isNaN(value)) {
      return "Please enter a valid number";
    }

    if (value < 0) {
      return "Amount cannot be negative";
    }

    if (value === 0) {
      return "Please enter an amount greater than 0";
    }

    if (!isCartEligible) {
      return "Cart must be at least ₹3,000 to redeem coins";
    }
    if (!hasMinCoins) {
      return "Minimum 500 Bignlean Coins required to redeem";
    }

    if (value > walletBalance) {
      return `Amount cannot exceed your available balance of ₹${walletBalance}`;
    }

    if (value > maxRedeemable) {
      return `You can redeem up to ₹${maxRedeemable} on this order`;
    }

    if (value % 1 !== 0) {
      return "Please enter a whole number (no decimals)";
    }

    return null;
  };

  return (
    <div>
      <div
        className="flex gap-3 sm-1 cursor-pointer items-center rounded-lg bg-white p-3 px-4"
        onClick={handleDialogOpen}
      >
        <input
          type="checkbox"
          className="w-[18px] h-[18px] cursor-pointer"
          checked={bnlCash > 0}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            if (!e.target.checked) {
              setBnlCash(0);
              setInputValue("");
            } else {
              handleDialogOpen();
            }
          }}
        />
        <p className="flex items-center gap-1">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            "Error loading balance"
          ) : (
            <>
              Use{" "}
              {bnlCash > 0
                ? `₹${bnlCash} of ${walletBalance}`
                : `${walletBalance}`}{" "}
              <CoinSmIcon /> Bignlean cash for this order
            </>
          )}
        </p>
      </div>

      {eligibilityMsg && (
        <p className="text-red-500 text-xs mt-2 px-4">{eligibilityMsg}</p>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Enter Bignlean Cash Amount
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {isLoading ? (
                "Loading balance..."
              ) : error ? (
                "Error loading balance"
              ) : (
                `Available balance: ₹${walletBalance}`
              )}
            </p>
            {!isLoading && !error && (
              <p className="text-xs text-gray-500 mb-4">
                Cart value: ₹{Number(cartPrice?.totalAmount || 0)} | Min to redeem: ₹3,000 | Min coins in wallet: 500
              </p>
            )}
            <input
              type="number"
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value;
                setInputValue(val);
              }}
              placeholder="Enter amount"
              className={`w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getInputError() ? 'border-red-500' : ''
                }`}
              min="0"
              step="1"
              disabled={isLoading || !!error}
            />
            {getInputError() && (
              <p className="text-red-500 text-sm mb-4">
                {getInputError()}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDialogCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDialogConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                disabled={isLoading || !!error}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UseCashCard = () => {
  return (
    <div className="sm-1 p-3 flex items-center justify-between rounded-lg bg-white">
      <div className="flex items-center gap-1">
        <p className="text-black text-sm not-italic font-normal">You earn</p>
        <p className="text-black text-sm not-italic flex items-center gap-1 font-normal">
          <CoinSmIcon /> 22 Bignlean cash on this order
        </p>
      </div>
    </div>
  );
};

const OrderCard = ({
  cartPrice,
  bnlCash,
  onRetry,
}: {
  cartPrice: CarttPrice | null | undefined;
  bnlCash: number;
  onRetry?: () => void;
}) => {
  if (!cartPrice) {
    return (
      <div className="bg-white rounded-lg p-6 w-full sm-1">
        <h2 className="text-black text-base not-italic font-semibold leading-4 mb-[22px]">
          Payment Detail
        </h2>
        <div className="flex flex-col gap-3">
          <div className="animate-pulse bg-gray-200 h-5 w-full rounded"></div>
          <div className="animate-pulse bg-gray-200 h-5 w-full rounded"></div>
          <div className="animate-pulse bg-gray-200 h-5 w-full rounded"></div>
          <div className="animate-pulse bg-gray-200 h-5 w-full rounded"></div>
          <div className="animate-pulse bg-gray-200 h-5 w-full rounded"></div>
          <div className="w-full h-[1px] bg-gray-300"></div>
          <div className="animate-pulse bg-gray-200 h-6 w-full rounded"></div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              Retry loading price details
            </button>
          )}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "0.00";
    return value.toFixed(2);
  };

  const totalAmount = Number(cartPrice.totalAmount) || 0;
  const couponDiscount = Number(cartPrice.couponDiscount) || 0;
  const shipping = Number(cartPrice.shiping) || 0;
  const discount = Number(cartPrice.discount) || 0;
  const cashAmount = Number(bnlCash) || 0;

  const cartTotal = totalAmount + couponDiscount;
  const amountPayable = Math.max(0, totalAmount + shipping - cashAmount);

  return (
    <div className="bg-white rounded-lg p-6 w-full sm-1">
      <h2 className="text-black text-base not-italic font-semibold leading-4 mb-[22px]">
        Payment Detail
      </h2>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-black text-sm not-italic font-normal leading-4">
            Cart Total
          </p>
          <p className="text-black text-right text-sm not-italic font-medium">
            ₹{formatCurrency(cartTotal)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-black text-sm not-italic font-normal leading-4">
            Coupon Savings
          </p>
          <p className="ml-auto text-right text-sm not-italic font-medium text-green-500">
            {couponDiscount > 0
              ? `-₹${formatCurrency(couponDiscount)}`
              : "₹0.00"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-black text-sm not-italic font-normal leading-4">
            Shipping Charges
          </p>
          <p className="text-black text-right text-sm not-italic font-medium">
            ₹{formatCurrency(shipping)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-black text-sm not-italic font-normal leading-4">
            Loyalty Savings
          </p>
          <p className="ml-auto text-right text-sm not-italic font-medium text-green-500">
            {cashAmount > 0 ? `-₹${formatCurrency(cashAmount)}` : "₹0.00"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-black text-sm not-italic font-normal leading-4">
            Total Discount
          </p>
          <button>
            <Info2Icon />
          </button>
          <p className="ml-auto text-right text-sm not-italic font-medium text-green-500">
            {discount > 0 ? `-₹${formatCurrency(discount)}` : "₹0.00"}
          </p>
        </div>
        <div className="w-full h-[1px] bg-gray-300"></div>
        <div className="flex items-center justify-between">
          <p className="text-black text-base not-italic font-semibold leading-4">
            Amount Payable
          </p>
          <p className="text-black text-right text-base not-italic font-semibold">
            ₹{formatCurrency(amountPayable)}
          </p>
        </div>
      </div>
    </div>
  );
};

type CarttPrice = {
  status: boolean;
  totalAmount: number;
  shiping: number;
  discount: number;
  couponDiscount: number;
  canUseBGLCash: boolean;
  afterUseBGLCash: number;
  isPremium: boolean;
};
