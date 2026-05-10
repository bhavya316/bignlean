import { useMutation } from "@tanstack/react-query";
import axios from "axios";
const base_url = process.env.NEXT_PUBLIC_BASE_URL;

async function sendContactUs(contactData: any) {
  const data = await axios({
    method: "POST",
    url: base_url + "/contact",
    data: contactData,
  });
  return data.data;
}

export const useSendContact = () => {
  return useMutation({ mutationFn: (data: any) => sendContactUs(data) });
};
