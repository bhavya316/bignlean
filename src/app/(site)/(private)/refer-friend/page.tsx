// "use client";
// import {
//   InfoIcon,
//   LinkIcon,
//   ShareIcon,
//   Wallet2Icons,
//   WalletStarIcon,
//   WhatsappIcon,
// } from "@/Icons";
// import { OutlinedButton, ReferalCodeCard } from "@/components";
// import PrimaryButton from "@/components/Buttons/PrimaryButton";
// import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";

// const isServer = () => typeof window === "undefined";


// export default function page() {
// if(isServer()){
// return (<></>);
// }
//   return (
//     <CustomPageWrapper heading="Refer a Friend">
//       <div className="flex max-[950px]:flex-col-reverse max-[950px]:gap-5">
//         <div className="flex-1 flex flex-col items-center gap-6">
//           <ReferOfferCard />
//           <StepCards />
//           <div className="h-[2px] w-[450px] max-[450px]:w-full bg-gray-300"></div>
//           <p className="text-black text-center text-base not-italic font-medium w-[400px] max-[400px]:w-full mb-2">
//             Share this code with your friends & Family and ask them to put it
//             during registering
//           </p>
//           <ReferalCodeCard />
//           <div className="flex w-[500px] max-[500px]:w-full max-[500px]:flex-col gap-3 justify-center mt-4">
//             <OutlinedButton label="More" icon={<ShareIcon />} />
//             <PrimaryButton label="Whatsapp" icon={<WhatsappIcon />} />
//           </div>
//         </div>
//         <div className="flex-1">
//           <img src={"/assets/refer/right.png"} className="w-full" />
//         </div>
//       </div>
//     </CustomPageWrapper>
//   );
// }

// const StepCards = () => {
//   return (
//     <div className="flex w-[400px] max-[450px]:w-full max-[450px]:flex-col gap-5">
//       <div className="flex flex-col items-center gap-2">
//         <LinkIcon />
//         <p className="text-center text-xs not-italic font-semibold leading-5 text-gradient">
//           1. Your refer your friends
//         </p>
//       </div>
//       <div className="flex flex-col items-center gap-2">
//         <InfoIcon />
//         <p className="text-center text-xs not-italic font-semibold leading-5 text-gradient">
//           2. They Signup using your referral code
//         </p>
//       </div>
//       <div className="flex flex-col items-center gap-2">
//         <Wallet2Icons />
//         <p className="text-center text-xs not-italic font-semibold leading-5 text-gradient">
//           3. You get BignLean cash in your wallet
//         </p>
//       </div>
//     </div>
//   );
// };

// const ReferOfferCard = () => {
//   return (
//     <div className="flex w-[500px] max-[500px]:w-full gap-3 items-center p-4 rounded-lg sm-3">
//       <WalletStarIcon />
//       <div>
//         <p className="text-black text-sm not-italic font-medium leading-5 mb-5">
//           Share your Referal link/code via Whatsapp / SMS and invite your
//           friend.
//         </p>
//         <p className="text-gradient text-xs not-italic font-bold leading-4">
//           You can Earn upto 500 BignLean Coin
//         </p>
//       </div>
//     </div>
//   );
// };
"use client";
import {
  InfoIcon,
  LinkIcon,
  ShareIcon,
  Wallet2Icons,
  WalletStarIcon,
  WhatsappIcon,
} from "@/Icons";
import { OutlinedButton, ReferalCodeCard } from "@/components";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";

export default function page() {
  const { userData } = useAppContext();

  // WhatsApp share handler
  const handleWhatsapp = () => {
    const referCode = userData?.referCode || "";
    const referLink = `https://bignlean.com/register?refer=${referCode}`;
    const shareText = `Join BignLean and get rewards! Use my referral code: ${referCode} or click ${referLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <CustomPageWrapper heading="Refer a Friend">
      <div className="flex max-[950px]:flex-col-reverse max-[950px]:gap-5">
        <div className="flex-1 flex flex-col items-center gap-6">
          <ReferOfferCard />
          <StepCards />
          <div className="h-[2px] w-[450px] max-[450px]:w-full bg-gray-300"></div>
          <p className="text-black text-center text-base not-italic font-medium w-[400px] max-[400px]:w-full mb-2">
            Share this code with your friends & Family and ask them to put it
            during registering
          </p>
          <ReferalCodeCard />
          <div className="flex w-[500px] max-[500px]:w-full max-[500px]:flex-col gap-3 justify-center mt-4">
            <OutlinedButton label="More" icon={<ShareIcon />} />
            <PrimaryButton label="Whatsapp" icon={<WhatsappIcon />} onClick={handleWhatsapp} />
          </div>
        </div>
        <div className="flex-1">
          <img src={"/assets/refer/right.png"} className="w-full" />
        </div>
      </div>
    </CustomPageWrapper>
  );
}

const StepCards = () => {
  return (
    <div className="flex w-[400px] max-[450px]:w-full max-[450px]:flex-col gap-5">
      <div className="flex flex-col items-center gap-2">
        <LinkIcon />
        <p className="text-center text-xs not-italic font-semibold leading-5 text-gradient">
          1. Your refer your friends
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <InfoIcon />
        <p className="text-center text-xs not-italic font-semibold leading-5 text-gradient">
          2. They Signup using your referral code
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Wallet2Icons />
        <p className="text-center text-xs not-italic font-semibold leading-5 text-gradient">
          3. You get BignLean cash in your wallet
        </p>
      </div>
    </div>
  );
};

const ReferOfferCard = () => {
  return (
    <div className="flex w-[500px] max-[500px]:w-full gap-3 items-center p-4 rounded-lg sm-3">
      <WalletStarIcon />
      <div>
        <p className="text-black text-sm not-italic font-medium leading-5 mb-5">
          Share your Referal link/code via Whatsapp / SMS and invite your
          friend.
        </p>
        <p className="text-gradient text-xs not-italic font-bold leading-4">
          You can Earn upto 500 BignLean Coin
        </p>
      </div>
    </div>
  );
};
