"use client";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import ContactCard from "../terms-and-conditions/ContactCard";

export default function Page() {
  return (
    <CustomPageWrapper heading="Returns & Refunds">
      <ContactCard
        heading="What is the general return policy on Bignlean.com - 14-Days Return Policy"
        paragraph={`We offer you complete peace of mind while ordering at Bignlean.com - you can return all items within 14 days of receipt of goods. Please ensure that the product is unused and the tags, boxes and other packaging is intact. If you are not satisfied with what you have bought, we'll gladly take it back within 14 days from the date of delivery, for that please send us pictures of the packaging and product(s) Complete Video Including Unboxing of Carton Packaging. Do not Break the seal of the Product. & Send it to All at support@bignlean.com If you have paid by card then we will reverse the payment. In case of Cash on Delivery or Bank Deposits as modes of payment, we will issue a cheque in the registered name of the customer. ( all the Refunds shall be only completed when our quality team checks all the valid points to claim the refund )`}
      />

      <ContactCard
        heading="What should I do if I receive a Damaged item, wrong product or missing units in my order?"
        paragraph={`If an item is found damaged, missing or incorrect as per your order & the description on our website, customers have to escalate a concern with us within 48 hours of delivery. Send us a picture of the packaging and complete Unboxing Video to claim the evidence and products at support@bignlean.com or call on 1800-266-1313 within those 48 hours (excluding gazetted holidays & Sunday). We will arrange a reverse pickup for the product and once the product is received by our warehouse team we shall take necessary steps to check the video provided evidence by the consumer and then issue either a full refund through Bignlean Cash (store credit) or a different item in exchange, as per your request. Replacements are subject to the availability of the particular product. Please note the usual 14-day return policy won’t be applicable in these kinds of cases.`}
      />

      <ContactCard
        heading="Is there a category specific policy for returns?"
        paragraph={`Nutrition: Products should be received in original packaging and sealed condition. Opened or used boxes will not be accepted as returns. For issues like rashes, stomach upset, headache, flavor like/dislike, flavor difference from one brand to other etc. products would not be applicable for return. Please consult with the doctor before buying the product.`}
        unorderList={[
          {
            heading: "Fitness Equipment/Accessories etc",
            orderList: [
              "Any Fitness Equipment/Accessory will be valid for replacement within 14 days of delivery.",
              "Any Fitness Equipment will be replaced in case of manufacturing defect only.",
              "Any Fitness Accessory will be replaced in case of manufacturing defect, size or colour change.",
              "5 years warranty of motor and 2 years warranty of other spare parts is valid only for Treadmill and Exercise Bikes."
            ]
          },
          {
            heading: "Following shall NOT be eligible for return or replacement:",
            orderList: [
              "Damages due to misuse of product",
              "Incidental damage due to malfunctioning of product",
              "Any consumable item which has been used or installed",
              "Products with tampered or missing serial / UPC numbers",
              "Combos sold won't be taken back/returned as individual units",
              "Any damage / defect which are not covered under the manufacturer's warranty",
              "Any product that is returned without all original packaging and accessories, including the box, manufacturer's packaging if any, and all other items originally included with the product(s) delivered"
            ]
          }
        ]}
      />
      <ContactCard
        heading=""
        paragraph={`Some special rules for promotional offers may override “Bignlean.com’s 14 Day Returns Policy". In case of any queries, please write to our customer care on support@bignlean.com or Cal 1800-266-1313`}
      />

      <ContactCard
        heading="I need to return an item, how do I arrange for a pick-up?"
        paragraph={`You can either write us at support@bignlean.com or call at 1800-266-1313 10 AM to 7 PM to initiate a return. Wherever possible we will facilitate the pick-up of the item. In case, the pick-up cannot be arranged by us, you can return the item through SpeedPost courier service and share tracking details and we will return the courier costs.`}
      />

      <ContactCard
        heading="What are the modes of refund available after cancellation?"
        paragraph={`In order to confirm cancellation of item(s) in your order, you need to indicate your refund preference. There are two modes of refund:`}
        unorderList={[
          { heading: "Bignlean.com Cash - If you choose this option, the amount will be added to your Bignlean.com cash." },
          { heading: "Back to Source - In this case, the money will be refunded back to the payment mode/account that was originally used to make the transaction." }
        ]}
      />
      <ContactCard
        heading=""
        paragraph={`Once you have requested the cancellation of item(s) in your order, Bignlean will complete the cancellation and initiate the refund, depending on your preference.`}
      />

      <ContactCard
        heading="What is the validity period of HK cash?"
        paragraph={`The validity period of Bignlean cash is generally 90 days from the date of issue. Please check your Bignlean cash email for exact date.`}
      />

      <ContactCard
        heading="Fraud and Scam Prevention"
        unorderList={[
          { heading: "Security Measures: Highlight the security protocols in place to protect customers' personal and financial information (e.g., encryption, secure payment gateways)." },
          { heading: "Warning Signs of Fraud: Educate customers about warning signs of potential fraud or scams and advise them on what to do if they suspect fraudulent activity." },
          { heading: "Reporting Fraud: Provide clear instructions on how customers can report suspected fraudulent transactions or activities." }
        ]}
      />

      <ContactCard
        heading="Fraudulent Transactions and Scams"
        unorderList={[
          { heading: "Policy on Fraudulent Transactions: Clearly state the consequences for engaging in fraudulent activities on the platform (e.g., legal action, account suspension)." },
          { heading: "Scam Awareness: Educate customers about common scams (e.g., phishing, identity theft) and provide tips to avoid falling victim to these scams." }
        ]}
      />

      <ContactCard
        heading="Exceptions and Special Cases"
        paragraph={`Bignlean.com is also available as a seller on JIO Mart, Amazon & Healthkart Platform - Any Product Purchased through this Platform please use and refer the all terms & Condition of the Vendor which offers Discount throw Various types of Payment Such as MasterCard, American Xpress & Razorpay, Paytm & Simpl or Cred Or PhonePe Payment Gateway Partner. In Case of any other charge-back claim from the consumer Bignlean.com is not responsible or any kind of return & and refunds.`}
      />
      <ContactCard
        heading=""
        paragraph={`They are using a Seller platform and all products sold by us are 100% authentic and Genuine and sourced directly from the brand manufacturer. Hence Please Co-ordinate with the Mentioned Vendor for any kind of charge Claim, Payment Claim or Return Claim.`}
      />
      <ContactCard
        heading=""
        paragraph={`If Any charge back request is raise by any customer after having products and consuming products after delivery and try to show the fake dispute to the Razorpay Or Paytm Gateway or any other third-party payment gateway on www.bignlean.com or on above mentioned platform shall be not agreed. Bignlean.com has enough evidence on every single order including the shipping and delivery note and the proof of delivery we have the right to deny the claim which is raised by the consumer false try in any condition.`}
      />

    </CustomPageWrapper>
  );
}
