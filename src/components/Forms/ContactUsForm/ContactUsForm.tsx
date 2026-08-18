import PrimaryButton from "@/components/Buttons/PrimaryButton";
import InputField from "@/components/FormComponents/InputField";
import { useSendContact } from "./contactHandler";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

export default function ContactUsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate } = useSendContact();
  const contactusHandler = (formData: FormData) => {
    setIsLoading(true);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    const data = { name, email, phone, message };
    mutate(data, {
      onSuccess: () => {
        toast.success("submitted successfully!!!");
        setIsLoading(false);
        formRef.current?.reset();
      },
      onError: () => {
        setIsLoading(false); // Handle loading state if submission fails
      }
    });
  };

  return (
    <div>
      <form className="flex flex-col gap-5" action={contactusHandler} ref={formRef}>
        <InputField
          name="name"
          required={true}
          type="text"
          placeholder="Name"
          shadow={false}
        />
        <InputField
          name="email"
          type="email"
          placeholder="Email"
          required={true}
          shadow={false}
        />
        <InputField
          name="phone"
          type="mobile"
          placeholder="Contact No"
          required={true}
          shadow={false}
        />
        <InputField
          name="message"
          type="textarea"
          placeholder="Message"
          shadow={false}
        />
        <PrimaryButton loading={isLoading} label="Send" type="submit" />
      </form>
    </div>
  );
}
