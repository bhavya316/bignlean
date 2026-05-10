import { useQueryClient } from "@tanstack/react-query";

export default function useGetQueryData(key: string) {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([key]);
  return { data };
}
