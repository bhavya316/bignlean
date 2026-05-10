"use client";
import React, { useState } from "react";
import { useCheckServiceability, ServiceabilityData } from "@/queries/Shipping";

interface ShippingServiceabilityProps {
  originPincode: string;
  destinationPincode: string;
  orderAmount: number;
  paymentType: 'prepaid' | 'cod';
  weight?: number;
  onServiceabilityCheck?: (data: ServiceabilityData | null) => void;
}

export default function ShippingServiceability({
  originPincode,
  destinationPincode,
  orderAmount,
  paymentType,
  weight = 500,
  onServiceabilityCheck
}: ShippingServiceabilityProps) {
  const [serviceabilityData, setServiceabilityData] = useState<ServiceabilityData | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const { mutate: checkServiceability } = useCheckServiceability();

  const handleCheckServiceability = () => {
    if (!originPincode || !destinationPincode || !orderAmount) {
      return;
    }

    setIsChecking(true);

    checkServiceability({
      origin: originPincode,
      destination: destinationPincode,
      payment_type: paymentType,
      order_amount: orderAmount,
      weight: weight
    }, {
      onSuccess: (response) => {
        const data = response?.data as ServiceabilityData;
        setServiceabilityData(data);
        onServiceabilityCheck?.(data);
        setIsChecking(false);
      },
      onError: (error) => {
        console.error("Serviceability check failed:", error);
        setServiceabilityData(null);
        onServiceabilityCheck?.(null);
        setIsChecking(false);
      }
    });
  };

  // Auto-check when props change
  React.useEffect(() => {
    if (originPincode && destinationPincode && orderAmount > 0) {
      handleCheckServiceability();
    }
  }, [originPincode, destinationPincode, orderAmount, paymentType, weight]);

  if (!serviceabilityData) {
    return (
      <div className="shipping-serviceability">
        {isChecking ? (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Checking shipping rates...
          </div>
        ) : (
          <button
            onClick={handleCheckServiceability}
            className="text-blue-600 hover:text-blue-800 underline"
            disabled={!originPincode || !destinationPincode || !orderAmount}
          >
            Check shipping rates
          </button>
        )}
      </div>
    );
  }

  if (!serviceabilityData.status || !serviceabilityData.data?.length) {
    return (
      <div className="shipping-serviceability">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">
            {serviceabilityData.message || "Shipping not available for this location"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-serviceability">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-3">Shipping Options</h4>
        <div className="space-y-3">
          {serviceabilityData.data.map((option, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{option.courier_name}</span>
                <span className="text-lg font-bold text-green-600">
                  ₹{option.total_amount}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Base Rate:</span>
                  <span>₹{option.base_rate}</span>
                </div>
                {option.fuel_surcharge > 0 && (
                  <div className="flex justify-between">
                    <span>Fuel Surcharge:</span>
                    <span>₹{option.fuel_surcharge}</span>
                  </div>
                )}
                {paymentType === 'cod' && option.cod_charges > 0 && (
                  <div className="flex justify-between">
                    <span>COD Charges:</span>
                    <span>₹{option.cod_charges}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span>Estimated Delivery:</span>
                  <span>{new Date(option.estimated_delivery).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
