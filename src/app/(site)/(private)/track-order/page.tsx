"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { ProccessingIcon } from "@/Icons";
import { OutlinedButton } from "@/components";
import Loader from "@/components/Loader/Loader";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useCancelOrder, useGetAllOrder } from "@/queries/Order";
import { useTrackShipment, useGetTracking, TrackingData } from "@/queries/Shipping";
import { getFlavorLabel, getOptionLabel } from "@/utils/variantPricing";
import { getFirstMediaUrl } from "@/utils/media";

const isCancelledStatusText = (value?: string | number | null) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return false;

  return (
    normalized === "cn" ||
    normalized === "cancel" ||
    normalized === "canceled" ||
    normalized === "cancelled" ||
    normalized.includes("cancel")
  );
};

const hasCancelledTrackingSignal = (trackingData?: TrackingData | null) => {
  if (!trackingData) return false;

  const data = trackingData as TrackingData & {
    current_status?: string;
    shipment_status?: string;
    status_code?: string;
    orderStatus?: string;
    isCancelled?: boolean;
  };

  if (data.isCancelled) return true;

  const directStatuses = [
    data.status,
    data.current_status,
    data.shipment_status,
    data.status_code,
    data.orderStatus,
  ];
  if (directStatuses.some(isCancelledStatusText)) return true;

  return (data.history || []).some((event: any) =>
    [
      event.status,
      event.status_code,
      event.current_status,
      event.message,
      event.description,
    ].some(isCancelledStatusText)
  );
};

const getEffectiveOrderStatus = (
  order: TrackOrder,
  trackingData?: TrackingData | null
) =>
  isCancelledStatusText(order?.status) || hasCancelledTrackingSignal(trackingData)
    ? "Cancelled"
    : order?.status;

export default function Page() {
  const { userData } = useAppContext();
  const { data, isLoading } = useGetAllOrder(userData?.id as number);
  const orders = [...(data?.data?.orders || [])].sort(
    (a: TrackOrder, b: TrackOrder) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <CustomPageWrapper
      heading="Track Order"
      className="relative flex flex-col gap-8"
      headingClass="mb-0"
    >
      {orders.length > 0 ? (
        orders.map((order: TrackOrder) => (
          <div key={order?.id} className="w-full flex flex-col gap-4">
            <p className="w-full text-end text-black text-sm not-italic font-medium max-[1000px]:top-0 max-[450px]:static">
              AWB Tracking no: {order?.trackingID || "Waiting for admin confirmation"}
            </p>
            <div className="flex flex-col gap-[22px]">
              <OrderCard order={order} userId={userData?.id} />
            </div>
          </div>
        ))
      ) : isLoading ? (
        <Loader />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      )}

      {/* Direct AWB Tracking Section */}
      {/* <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Track by AWB Number</h3>
        <AWBTrackingSection />
      </div> */}
    </CustomPageWrapper>
  );
}

const OrderCard = ({ order, userId }: { order: TrackOrder; userId: any }) => {
  const { data: trackingResponse } = useGetTracking(order?.trackingID ? String(order.trackingID) : null);
  const trackingData = trackingResponse?.data?.status ? trackingResponse.data.data : null;
  const effectiveStatus = getEffectiveOrderStatus(order, trackingData);

  return (
    <div className="sm-3 bg-white rounded-lg p-[30px] max-[550px]:p-3">
      <div className="flex gap-2 mb-7">
        <ProccessingIcon />
        <div className="flex flex-col gap-1">
          <span className="text-blue-900 text-center text-base not-italic font-semibold">
            {effectiveStatus} - {order?.orderID}
          </span>
          <span className="text-gray-500 text-center text-xs not-italic font-medium">
            On {new Date(order?.createdAt).toDateString()}
          </span>
        </div>
      </div>
      <div className="flex gap-8 max-[1000px]:gap-4 max-[860px]:flex-col max-[600px]:gap-5">
        <ProductDetailCard order={order} userId={userId} effectiveStatus={effectiveStatus} />
        <ProcessingCard order={order} trackingData={trackingData} effectiveStatus={effectiveStatus} />
      </div>
    </div>
  );
};

const getOrderItemMeta = (product: TrackOrderProduct) => {
  if (product?.isCombo) return "Combo";

  const unit = getOptionLabel(product?.selectedUnits || product?.weight);
  const flavor = getFlavorLabel(
    (product?.selectedFlavor || product?.selectedFlavour || product?.flavor) as any
  );

  return [unit, flavor].filter(Boolean).join(" - ");
};

const ProductDetailCard = ({
  order,
  userId,
  effectiveStatus,
}: {
  order: TrackOrder;
  userId: any;
  effectiveStatus: string;
}) => {
  const { mutate: cancelOrder } = useCancelOrder();
  const [isCancelling, setIsCancelling] = useState(false);
  const productAmount = Number(order?.amount || 0);
  const shipping = Number(order?.shiping || 0);
  const couponDiscount = Number(order?.couponDiscount || 0);
  const walletCash = Number(order?.bglCash || 0);
  const netBeforeShipping =
    Number(order?.totalAmount || 0) ||
    Math.max(0, productAmount - couponDiscount - walletCash);
  const payable = netBeforeShipping + shipping;
  const formatMoney = (value: number) => `₹${Math.max(0, value).toFixed(2)}`;

  const handleCancelOrder = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setIsCancelling(true);
      cancelOrder(order.id, {
        onSuccess: () => {
          toast.success("Order cancelled successfully");
          setIsCancelling(false);
          window.location.reload();
        },
        onError: (error) => {
          toast.error("Failed to cancel order: " + (error?.message || "Unknown error"));
          setIsCancelling(false);
        }
      });
    }
  };

  return (
    <div className="flex flex-1 gap-6 items-start max-[560px]:flex-col">
      <div className="flex min-w-[260px] flex-col gap-4 max-[860px]:flex-1 max-[560px]:w-full">
        {order?.product?.map((product, index) => (
          <div key={`${product?.id || index}-${index}`} className="flex gap-4">
            <img
              src={getFirstMediaUrl(product?.images, "/assets/product.png")}
              alt={product?.name || "product"}
              className="h-[86px] w-[86px] object-contain rounded bg-gray-50 max-[600px]:h-[58px] max-[600px]:w-[58px]"
            />
            <div className="flex flex-col gap-1">
              <p className="text-black text-base not-italic font-medium max-[1000px]:text-sm">
                {product?.name}
              </p>
              <p className="text-black text-sm not-italic font-normal opacity-40">
                {getOrderItemMeta(product)}
              </p>
              <p className="text-xs text-gray-500">
                Qty {product?.qty || 0}
                {product?.unitPrice ? ` | ${formatMoney(Number(product.unitPrice))}` : ""}
              </p>
            </div>
          </div>
        ))}
        {!isCancelledStatusText(effectiveStatus) && (
          <OutlinedButton
            onClick={handleCancelOrder}
            label={isCancelling ? "Cancelling..." : "Cancel"}
            disable={isCancelling}
            className="mt-auto py-[8px] px-[10px] self-start max-[860px]:mt-0"
          />
        )}
      </div>
      <div className="ml-auto min-w-[180px] rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm max-[560px]:ml-0 max-[560px]:w-full">
        <div className="flex justify-between gap-4 font-semibold text-black">
          <span>Total</span>
          <span>{formatMoney(payable)}</span>
        </div>
        {productAmount > 0 && (
          <div className="mt-2 flex justify-between gap-4 text-xs text-gray-500">
            <span>Items</span>
            <span>{formatMoney(productAmount)}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="mt-1 flex justify-between gap-4 text-xs text-green-600">
            <span>Coupon</span>
            <span>-{formatMoney(couponDiscount)}</span>
          </div>
        )}
        {walletCash > 0 && (
          <div className="mt-1 flex justify-between gap-4 text-xs text-green-600">
            <span>Wallet</span>
            <span>-{formatMoney(walletCash)}</span>
          </div>
        )}
        <div className="mt-1 flex justify-between gap-4 text-xs text-gray-500">
          <span>Shipping</span>
          <span>{shipping > 0 ? formatMoney(shipping) : "Free"}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Paid via {order?.paymentMethod || "N/A"}
        </div>
      </div>
    </div>
  );
};

const ProcessingCard = ({
  order,
  trackingData,
  effectiveStatus,
}: {
  order: TrackOrder;
  trackingData?: TrackingData;
  effectiveStatus: string;
}) => {
  const getStepDetails = (orderStatus: string, tData?: TrackingData) => {
    const baseSteps = [
      { title: "Order Placed", detail: "Waiting for admin confirmation" },
      { title: "Shipped", detail: "Shipment will start after confirmation" },
      { title: "Out for Delivery", detail: "Not yet out for delivery" },
      { title: "Delivered", detail: "Not yet delivered" }
    ];

    const currentStatus = (tData?.status || orderStatus).toUpperCase();

    // Determine completion index (1 to 4)
    let completedCount = 0;
    if (tData) {
      if (currentStatus === 'DL') completedCount = 4;
      else if (currentStatus === 'FD') completedCount = 3;
      else if (['IT', 'EX', 'PP', 'SHIPPED'].includes(currentStatus)) completedCount = 2;
      else completedCount = 1; // If tracking exists, it's at least accepted/confirmed
    } else {
      switch (orderStatus) {
        case 'Delivered':
          completedCount = 4;
          break;
        case 'Out_for_Delivery':
          completedCount = 3;
          break;
        case 'Shipped':
          completedCount = 2;
          break;
        case 'Accepted':
          completedCount = 1;
          break;
        case 'Processing':
        default:
          completedCount = 0;
          break;
      }
    }

    return { steps: baseSteps, completedSteps: completedCount };
  };

  const isRTO = trackingData?.status?.toUpperCase().startsWith('RT');
  const isCancelled = isCancelledStatusText(effectiveStatus) || hasCancelledTrackingSignal(trackingData);
  const { steps, completedSteps } = getStepDetails(effectiveStatus || order?.status, trackingData);

  return (
    <div className="flex-1 h-full max-[450px]:flex-col max-[450px]:items-start max-[450px]:justify-center max-[450px]:gap-5">
      {isCancelled || isRTO ? (
        <div className="flex flex-col items-center">
          <div className={`w-[44px] h-[44px] flex items-center justify-center rounded-full ${isRTO ? 'bg-orange-100 border-orange-500' : 'bg-red-100 border-red-500'} border-2 mb-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isRTO ? 'text-orange-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isRTO ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </div>
          <p className={`${isRTO ? 'text-orange-600' : 'text-red-600'} text-base font-medium`}>
            {isRTO ? `RTO Status: ${trackingData?.status}` : 'Order Cancelled'}
          </p>
          {isRTO && trackingData?.history?.[0] && (
            <p className="text-gray-500 text-xs mt-1 text-center font-normal">
              {trackingData.history[0].message} - {trackingData.history[0].location}
            </p>
          )}
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between px-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative flex-1 min-w-0">
                {/* Step Circle */}
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${index < completedSteps
                    ? 'bg-green-500'
                    : 'border-2 border-gray-300 bg-white'
                    }`}>
                    {index < completedSteps ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    )}
                  </div>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute top-1/2 left-10 w-[130px] ml-[7px] h-1 transform -translate-y-1/2 transition-colors duration-300 ${index < completedSteps - 1 ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                  )}
                </div>

                {/* Title */}
                <p className={`text-black text-sm font-semibold mt-2 text-center w-full break-words ${index < completedSteps ? 'opacity-100' : 'opacity-40'}`}>
                  {step.title}
                </p>

                {/* Detail */}
                <p className={`text-xs mt-1 text-center w-full break-words min-h-[16px] ${index === completedSteps - 1 ? 'text-blue-600 font-medium' : 'text-gray-400 opacity-60'}`}>
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AWBTrackingSection = () => {
  const [awbNumber, setAwbNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<TrackingData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState("");

  const { mutate: trackShipment } = useTrackShipment();

  const handleTrack = () => {
    if (!awbNumber.trim()) {
      setError("Please enter an AWB number");
      return;
    }

    setIsTracking(true);
    setError("");
    setTrackingResult(null);

    trackShipment(awbNumber.trim(), {
      onSuccess: (response) => {
        if (response?.data?.status) {
          setTrackingResult(response.data.data);
        } else {
          setError(response?.data?.message || "Failed to fetch tracking information");
        }
        setIsTracking(false);
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || "Error tracking shipment");
        setIsTracking(false);
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'Delivered': 'text-green-600',
      'In Transit': 'text-blue-600',
      'Out for Delivery': 'text-orange-600',
      'Pending': 'text-yellow-600',
      'Cancelled': 'text-red-600',
      'Returned': 'text-red-600'
    };
    return statusColors[status] || 'text-gray-600';
  };

  return (
    <div className="awb-tracking">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter AWB Number"
          value={awbNumber}
          onChange={(e) => setAwbNumber(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleTrack}
          disabled={isTracking}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTracking ? "Tracking..." : "Track"}
        </button>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {trackingResult && (
        <div className="tracking-details bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-600">AWB Number</label>
              <p className="font-semibold">{trackingResult.awb_number || awbNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className={`font-semibold ${getStatusColor(trackingResult.status)}`}>
                {trackingResult.status || 'Unknown'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Courier ID</label>
              <p className="font-semibold">{trackingResult.courier_id || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Order ID</label>
              <p className="font-semibold">{trackingResult.order_number || 'N/A'}</p>
            </div>
          </div>

          {trackingResult.pdd && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">Estimated Delivery</label>
              <p className="font-semibold">{formatDate(trackingResult.pdd)}</p>
            </div>
          )}

          {trackingResult.history && trackingResult.history.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Tracking History</h4>
              <div className="space-y-3">
                {trackingResult.history.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{event.message}</span>
                        <span className="text-sm text-gray-500">{formatDate(event.event_time)}</span>
                      </div>
                      {event.location && (
                        <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Status Code: {event.status_code}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

type TrackOrder = {
  id: number;
  user: number;
  product: TrackOrderProduct[];
  address: number;
  usedCoupon: boolean;
  coupon: number | string;
  couponDiscount: number;
  amount: number;
  qty: number[];
  paymentMethod: string;
  transactionId: string | number;
  usedBGLCash: boolean;
  bglCash: number;
  earnedBglCash: number;
  shiping: number;
  totalAmount: number;
  orderID: string;
  trackingID: string | number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type TrackOrderProduct = {
  id: number;
  catId?: number;
  subCatId?: number;
  name: string;
  price?: number;
  sellingPrice?: number;
  premiumPrice?: number;
  unitPrice?: number;
  expireDate?: string;
  isBestSeller?: boolean;
  weight?: string | number;
  stock?: number;
  flavor?: string;
  selectedFlavor?: string;
  selectedFlavour?: string;
  selectedUnits?: string;
  isCombo?: boolean;
  images: string[];
  qty: number;
};
