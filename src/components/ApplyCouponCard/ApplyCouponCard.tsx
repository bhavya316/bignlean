"use client";
import { useGEtCouponsList } from "@/queries/Product";
import { useEffect, useState } from "react";

export default function ApplyCouponCard({
  setCouponId,
  appliedCoupon,
}: {
  setCouponId: any;
  appliedCoupon?: string | null;
}) {
  const { data } = useGEtCouponsList();
  const [coupon, setCoupon] = useState<string>(appliedCoupon || "");
  const [pendingCoupon, setPendingCoupon] = useState<any>(null);
  const [applied, setApplied] = useState<boolean>(Boolean(appliedCoupon));
  const [error, setError] = useState<boolean>(false);

  const getDiscountLabel = (couponData: any) => {
    if (!couponData) return "";
    if (couponData.category === "Price-wise") {
      return `₹${couponData.discount} off`;
    }
    return `${couponData.discount}% off`;
  };

  const couponHandler = (e: any) => {
    e.preventDefault();
    const requestedCoupon = coupon.trim();
    const avaiable = data?.data?.coupons.find(
      (cou: any) =>
        cou?.coupon?.toLowerCase() === requestedCoupon.toLowerCase()
    );
    if (avaiable) {
      setPendingCoupon(avaiable);
      setError(false);
    } else {
      setError(true);
    }
  };

  const confirmCoupon = () => {
    if (!pendingCoupon) return;
    setCouponId(pendingCoupon.coupon);
    setCoupon(pendingCoupon.coupon);
    setApplied(true);
    setError(false);
    setPendingCoupon(null);
  };

  const cancelConfirmation = () => {
    setPendingCoupon(null);
  };

  const cancelCoupon = (e: any) => {
    e.preventDefault();
    setApplied(false);
    setCoupon("");
    setCouponId(null);
    setPendingCoupon(null);
  };

  useEffect(() => {
    if (appliedCoupon) {
      setCoupon(appliedCoupon);
      setApplied(true);
      setError(false);
    } else {
      setCoupon("");
      setApplied(false);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    if (coupon.length === 0) {
      setError(false);
      setPendingCoupon(null);
    }
  }, [coupon]);
  return (
    <>
      <form
        onSubmit={couponHandler}
        className="flex flex-col gap-4 sm-1 rounded-lg p-4 bg-white"
      >
        <p className="text-black text-sm not-italic font-normal leading-4">
          Apply coupon code{" "}
        </p>

        <label
          className={`border ${
            error
              ? "border-red-600"
              : applied
              ? "border-green-600"
              : "border-black/50"
          }  p-2 flex items-center justify-between overflow-hidden rounded-md`}
        >
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter Code"
            className="outline-none"
            required
          />
          {applied ? (
            <button
              onClick={cancelCoupon}
              className="text-red-600 font-bold text-sm bg-transparent"
            >
              Cancel
            </button>
          ) : (
            <button
              type="submit"
              className="text-red-600 font-bold text-sm bg-transparent"
            >
              Apply
            </button>
          )}
        </label>
      </form>

      {pendingCoupon && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[360px] rounded-lg bg-white p-5 shadow-xl">
            <p className="text-black text-base font-semibold">
              Apply coupon {pendingCoupon.coupon} for{" "}
              {getDiscountLabel(pendingCoupon)}?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelConfirmation}
                className="rounded-md border border-black/20 px-4 py-2 text-sm font-semibold text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCoupon}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
