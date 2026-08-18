import { placeOrder } from "@/queries/Order";
import axiosInstance from "@/lib/axios";

type OrderPayload = {
  userid: number;
  addressid: number;
  paymentMethod: string;
  transactionId: string | null;
  bglCash: number;
  couponCode?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
};

type RazorpayCheckoutConfig = {
  name?: string;
  description?: string;
  image?: string;
  themeColor?: string;
};

type RazorpayOrderResponse = {
  status?: boolean;
  message?: string;
  keyId?: string;
  amount?: number;
  currency?: string;
  orderId?: string;
  receipt?: string;
  checkout?: RazorpayCheckoutConfig;
};

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  name: string;
  description: string;
  image?: string;
  currency: string;
  amount: number;
  order_id: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
  retry: {
    enabled: boolean;
  };
  modal: {
    confirm_close: boolean;
    ondismiss: () => void;
  };
  handler: (response: RazorpayPaymentResponse) => Promise<void>;
};

type RazorpayInstance = {
  open: () => void;
  on: (eventName: "payment.failed", handler: (response: any) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

const RAZORPAY_CHECKOUT_SCRIPT_ID = "razorpay-checkout-js";

export const initializeRazorpay = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById(
      RAZORPAY_CHECKOUT_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = RAZORPAY_CHECKOUT_SCRIPT_ID;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (payload: OrderPayload) => {
  return axiosInstance<RazorpayOrderResponse>({
    method: "POST",
    url: "/razorpay/order",
    data: {
      userid: payload.userid,
      addressid: payload.addressid,
      couponCode: payload.couponCode,
      bglCash: payload.bglCash,
    },
  });
};

export const makePayment = async ({
  payload,
  amount,
  prefill,
}: {
  payload: OrderPayload;
  amount: number;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}) => {
  const res = await initializeRazorpay();

  if (!res || !window.Razorpay) {
    throw new Error("Razorpay failed to load");
  }

  const orderResponse = await createRazorpayOrder(payload);
  const gatewayOrder = orderResponse?.data || {};
  const checkout = gatewayOrder.checkout || {};
  const key = gatewayOrder.keyId;
  const orderId = gatewayOrder.orderId;
  const gatewayAmount = gatewayOrder.amount;
  const Razorpay = window.Razorpay;

  if (!gatewayOrder.status) {
    throw new Error(gatewayOrder.message || "Unable to create Razorpay order");
  }
  if (!key) {
    throw new Error("Razorpay key is not configured on the backend");
  }
  if (!orderId || !gatewayAmount || !Razorpay) {
    throw new Error("Unable to create Razorpay order");
  }

  const publicEnvKey = process.env.NEXT_PUBLIC_RAZOR_PAY_KEY;
  if (publicEnvKey && publicEnvKey !== key) {
    console.warn(
      "Razorpay public key differs from backend order key. Using backend key."
    );
  }

  return new Promise((resolve, reject) => {
    const options: RazorpayCheckoutOptions = {
      key,
      name: checkout.name || "BigNLean",
      description:
        checkout.description || "Fitness Supplements & Sports Nutrition",
      image: checkout.image || "https://bignlean.com/assets/logo.png",
      currency: gatewayOrder.currency || "INR",
      amount: gatewayAmount || amount,
      order_id: orderId,
      prefill: prefill || {},
      notes: {
        source: "bignlean-web",
        receipt: gatewayOrder.receipt || "",
      },
      theme: {
        color: checkout.themeColor || "#E70F0F",
      },
      retry: {
        enabled: true,
      },
      modal: {
        confirm_close: true,
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
      handler: async function (response: RazorpayPaymentResponse) {
        try {
          const data = await placeOrder({
            ...payload,
            transactionId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
    };

    const paymentObject = new Razorpay(options);
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
