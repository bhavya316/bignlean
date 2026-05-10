"use client";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import ContactCard from "../terms-and-conditions/ContactCard";

export default function Page() {
  return (
    <CustomPageWrapper heading="Returns & Refunds">
      <ContactCard
        heading="Overview"
        paragraph={`We aim to make returns simple and fair. If you receive a damaged, tampered, or incorrect product, you can raise a return request within 7 days of delivery. All items must be unused, with original seals, tags, and packaging intact.`}
      />
      <ContactCard
        heading="Eligible Conditions"
        unorderList={[
          { heading: "Item delivered is damaged or tampered." },
          { heading: "Wrong item or variant delivered." },
          { heading: "Manufacturing defect confirmed by brand/service center." },
          { heading: "Item sealed and unused; original packaging retained." },
        ]}
      />
      <ContactCard
        heading="Non‑Eligible Conditions"
        unorderList={[
          { heading: "Opened, used, or partially consumed products." },
          { heading: "Damage due to improper storage or misuse after delivery." },
          { heading: "Freebies or promotional items without the main product return." },
        ]}
      />
      <ContactCard
        heading="Process"
        unorderList={[
          { heading: "Go to Track Order and select the order to raise a return." },
          { heading: "Upload clear images/video of the issue for verification." },
          { heading: "Our team reviews within 48 hours and schedules pickup if approved." },
          { heading: "After QC at our hub, refund is initiated to original payment method." },
        ]}
      />
      <ContactCard
        heading="Refund Timelines"
        paragraph={`Refunds are typically processed within 3–7 business days after the returned item passes quality check. For prepaid orders, refunds go to the original payment source; for COD, we process via bank transfer.`}
      />
      <ContactCard
        heading="Need Help?"
        paragraph={`Write to support@bignlean.com or call 1800-266-1313 for assistance with returns and refunds.`}
      />
    </CustomPageWrapper>
  );
}
