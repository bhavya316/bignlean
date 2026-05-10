import { placeOrder } from "@/queries/Order";

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export const makePayment = async ({
  payload,
  amount,
}: {
  payload: {
    userid: number;
    addressid: number;
    paymentMethod: string;
    transactionId: string | null;
    bglCash: number;
    couponCode?: string;
  };
  amount: number;
}) => {
  const res = await initializeRazorpay();

  if (!res) {
    throw new Error("Razorpay failed to load");
  }

  if (!process.env.NEXT_PUBLIC_RAZOR_PAY_KEY) {
    throw new Error("Razorpay key is not configured");
  }

  return new Promise((resolve, reject) => {
    let options = {
      key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY,
      name: "Bignlean pvt ltd.",
      currency: "INR",
      amount: amount,
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
      handler: async function (response: any) {
        try {
          const data = await placeOrder({
            ...payload,
            transactionId: response.razorpay_payment_id,
          });
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
    };
    //@ts-ignore
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response: any) {
      reject(
        new Error(
          response?.error?.description ||
            response?.error?.reason ||
            "Payment failed"
        )
      );
    });
    paymentObject.open();
  });
};
