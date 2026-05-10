import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export function useCommanApi(key: string, path: string) {
  return useQuery({
    queryKey: [key],
    queryFn: () => axiosInstance.get(path),
  });
}
