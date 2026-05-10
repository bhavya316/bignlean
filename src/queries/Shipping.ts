import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export type ServiceabilityOption = {
  courier_name: string;
  total_amount: number;
  base_rate: number;
  fuel_surcharge: number;
  cod_charges: number;
  estimated_delivery: string;
};

export type ServiceabilityData = {
  status: boolean;
  message?: string;
  data: ServiceabilityOption[];
};

export type TrackingHistory = {
  status_code: string;
  location: string;
  event_time: string;
  message: string;
};

export type TrackingData = {
  id: string;
  order_id: string;
  order_number: string;
  created: string;
  awb_number: string;
  courier_id: string;
  warehouse_id?: string;
  rto_warehouse_id?: string;
  status: string;
  shipment_info?: string;
  pdd?: string;
  exception_count?: string;
  pod_link?: string;
  history: TrackingHistory[];
};

async function checkServiceability(payload: {
  origin: string;
  destination: string;
  payment_type: string;
  order_amount: number;
  weight: number;
}) {
  return axios({
    method: "POST",
    url: `${base_url}/admin/shipping/serviceability`,
    data: payload,
  });
}

export function useCheckServiceability() {
  return useMutation({
    mutationFn: (payload: {
      origin: string;
      destination: string;
      payment_type: string;
      order_amount: number;
      weight: number;
    }) => checkServiceability(payload),
  });
}

async function trackShipment(awb: string) {
  return axios({
    method: "GET",
    url: `${base_url}/admin/shipping/track/${awb}`,
  });
}

export function useTrackShipment() {
  return useMutation({
    mutationFn: (awb: string) => trackShipment(awb),
  });
}

export function useGetTracking(awb: string | null) {
  return useQuery({
    queryKey: ["trackOrder", awb],
    queryFn: () => trackShipment(awb as string),
    enabled: !!awb,
  });
}

