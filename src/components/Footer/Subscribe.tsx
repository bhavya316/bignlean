import Image from "next/image";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/subscribe", { email });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-gray-100 py-3 px-5">
      <h3 className="text-blue-900 text-base not-italic font-normal leading-6 mb-3">
        Subscribe
      </h3>

      <form onSubmit={handleSubmit} className="flex bg-white overflow-hidden rounded-[15px] ">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="outline-none px-5 flex-[0.7] rounded-l-[15px] border border-gray-400"
          placeholder="Enter your email"
        />
        <PrimaryButton
          type="submit"
          loading={loading}
          disable={loading}
          label=">"
          className="rounded-l-none rounded-r-[15px] flex-[0.3] px-[20px]"
        />
      </form>

      <p className="mb-5 mt-1 text-black text-xs not-italic font-normal leading-6">
        <span className="text-red-500">*</span>Get newsletters and exclusive
        offers
      </p>

      <div className="flex justify-between">
        <Image
          src={"/assets/footer/sub1.png"}
          alt="footer"
          width={68}
          height={60}
        />
        <Image
          src={"/assets/footer/sub2.png"}
          alt="footer"
          width={65}
          height={60}
        />
        <Image
          src={"/assets/footer/sub3.png"}
          alt="footer"
          width={69}
          height={62}
        />
      </div>
    </div>
  );
}
