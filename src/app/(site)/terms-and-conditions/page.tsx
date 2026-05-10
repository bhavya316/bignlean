"use client";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import ContactCard, {
  generalTermOfUseList,
  usageRestrictionsList,
} from "./ContactCard";

export default function page() {
  return (
    <CustomPageWrapper heading="Terms and Conditions">
      <ContactCard
        heading="Introduction"
        paragraph={`Bignlean.com(‘Website’) is an online service owned, operated and
          managed by Bignlean Store (‘Bignlean.com’ or ‘we’ or ‘us’). In
          using/accessing the website, you are deemed to have accepted the terms
          and conditions of the agreement listed below or as may be revised from
          time to time (‘User Agreement’), which is, for an indefinite period
          and you understand and agree that you are bound by such terms till the
          time you access this Website. If you have any queries about the terms
          and conditions of this User Agreement or have any comments or
          complaints on or about the Website, please email us at
          support@bignlean.com or call us on 02516699820. We reserve the right
          to change the terms and conditions of this User Agreement from time to
          time without any obligation to inform you and it is your
          responsibility to look through them as often as possible.`}
      />
      <ContactCard
        heading="Ownership of rights:"
        paragraph={` Any use of this Website or its contents, including copying or storing
          it or them in whole or part, other than for your own personal,
          non-commercial use is prohibited without the explicit permission of
          Bignlean.com. All information displayed, transmitted or carried on the
          Website is protected by copyright and other intellectual property
          laws. Copyrights and other intellectual property in respect of the
          some of the content on the Website may be owned by the third parties.
          This site is designed, updated and maintained by Bignlean.com or its
          licensors. You shall not modify, publish, transmit, transfer, sell,
          reproduce, create derivative work from, distribute, repost, perform,
          display or in any way commercially exploit any of the content
          available on the Website.`}
      />
      <ContactCard
        heading="The accuracy of content and invitation to offer:"
        paragraph={`We have taken all care and precaution to try and provide accurate data
          and information. In the preparation of the content of this Website, to
          ensure that prices quoted are correct at time of publishing and all
          products have been fairly described. All prices are displayed
          inclusive of GST. Services, however, are listed exclusive of service
          tax as rules for service tax vary with different services. Packaging
          may vary from that shown. The weights, dimensions and capacities given
          are approximate only. We have made every effort to display as
          accurately as possible the colours of our products that appear on the
          Website. However, as the actual colours you see will depend on your
          monitor, we cannot guarantee that your monitor’s display of any colour
          will accurately reflect the colour of the product on delivery. All
          products/services and information displayed on the Website constitute
          an invitation to offer. Your order for purchase constitutes your offer
          which shall be subject to the terms and conditions of this User
          Agreement. We reserve the right to accept or reject your offer in part
          or in full. Our acceptance of your order will take place upon dispatch
          of the product(s) ordered. Dispatch of all the product(s) ordered, may
          or may not happen at the same time, in such a scenario that portion of
          the order which has been dispatched will be deemed to have been
          accepted by us and the balance would continue to be on offer to us and
          we reserve the right to accept or reject such balance order. No act or
          omission of Bignlean.com prior to the actual dispatch of the product
          (s) ordered will constitute acceptance of your offer. If you have
          supplied us with your email address or phone number, we will notify
          you by email and/or phone number, as the case may be, as soon as
          possible to confirm receipt of your order and email/contact you again
          to confirm dispatch and therefore acceptance of the order.`}
      />
      <ContactCard
        heading="General Terms of Use:"
        unorderList={generalTermOfUseList}
      />
      <ContactCard
        heading="Usage Restrictions:"
        unorderList={usageRestrictionsList}
      />
      <ContactCard
        heading="Quantity Restrictions:"
        paragraph={`We reserve the right, at our sole discretion, to limit the number of items purchased per person, per household or per order. These restrictions may be applicable to orders placed by the same account, the same credit/debit card, and also to orders that use the same billing and/or shipping address. We will provide notification to the customer should such limits be applied. We also reserve the right, at our sole discretion, to prohibit sales to anyone as we may deem fit.`}
      />
      <ContactCard
        heading="Pricing Information:"
        paragraph={`While we strive to provide accurate product and pricing information, pricing or typographical errors may occur. We cannot confirm the price of a product until after you order. In the event that a product is listed at an incorrect price or with incorrect information due to an error in pricing or product information, we shall have the right, at our sole discretion, to refuse or cancel any orders placed for that product, unless the product has already been dispatched. In the event that an item is mispriced, we may, at our sole discretion, either contact you for instructions or cancel your order and notify you of such cancellation. Unless the product ordered by you has been dispatched, your offer will not be deemed accepted and we will have the right to modify the price of the product and contact you for further instructions using the e-mail address or the contact number provided by you during the time of registration, or cancel the order and notify you of such cancellation. In the event, we accept your order the same shall be debited to your credit/debit card account and duly notified to you by email or the contact number, as the case may be, that the payment has been processed. The payment may be processed prior to dispatch of the product that you have ordered. If we have to cancel the order after we have processed the payment, the said amount will be reversed back to your credit/debit card account. We strive to provide you with the best value, however, prices and availability are subject to change without notice. Our promotional offers/discounts do not site wide and are limited to selected categories. Coupon codes may not be applicable on categories like diapers, baby food etc. or such other product or service as may be determined by us in our sole discretion.`}
      />
      <ContactCard
        heading="Indemnity:"
        paragraph={`We disclaim all warranties or conditions, whether expressed or implied, (including without limitation implied, warranties or conditions of information and context). We shall not be liable to any person for any loss or damage which may arise from the use of any of the information contained in any of the materials on this Website. This User Agreement and any contractual obligation between us and you will be governed by the laws of India, subject to the exclusive jurisdiction of Courts in Mumbai. All disputes will be subject to arbitration in Mumbai in English by a single arbitrator appointed by us under the Arbitration and Conciliation Act, 1996. Each party to the arbitration shall bear its own cost. You agree to defend, indemnify and hold harmless Bignlean.com, its employees, directors, officers, agents and their successors and assigns from and against any and all claims, liabilities, damages, losses, costs and expenses, including attorney’s fees, caused by or arising out of claims based upon your actions or inactions, which may result in any loss or liability to Bignlean.com or any third party including but not limited to breach of any warranties, representations or undertakings or in relation to the non-fulfillment of any of your obligations under this User Agreement or arising out of your violation of any applicable laws, regulations including but not limited to intellectual property rights, payment of statutory dues and taxes, claim of libel, defamation, violation of rights of privacy or publicity, loss of service by other subscribers and infringement of intellectual property or other rights. This clause shall survive the expiry or termination of this User Agreement.`}
      />
      <ContactCard
        heading="Eligibility to use:"
        paragraph={`Use of the Website is available only to persons who can form legally binding contracts under applicable law. Persons who are “incompetent to contract” within the meaning of the Indian Contract Act, 1872 including un-discharged insolvents etc. are not eligible to use the Website. We reserve the right to terminate your membership and refuse to provide you with access to the Website at our sole discretion. The Website is not available to persons whose membership has been suspended or terminated by us for any reason whatsoever. If you are registering as a business entity, you represent that you have the authority to bind the entity to this User Agreement. We make no representation that any products or services referred to in the materials on this Website are appropriate for use, or available outside India. Those who choose to access this Website from outside India are responsible for compliance with local laws if and to the extent local laws are applicable. We will deliver the products only within India and will not be liable for any claims relating to any products ordered from outside India. Some Indian states prohibit direct sale of merchandise from other states and require special documentation to effect such a sale without dual taxation, if we receive an order from such states or to be delivered to such states under such circumstances we retain the right to accept or reject the order at our sole discretion. Those who choose to access this Website from Indian states which restrict such use are responsible for compliance with local laws if and to the extent local state laws are applicable. We will deliver the products only within states having open import policy and will not be liable for any claims relating to any products ordered from restricted states. Except where additional terms and conditions are provided which are product specific, these terms and conditions supersede all previous representations, understandings, or agreements and shall prevail notwithstanding any variance with any other terms of any order submitted.`}
      />
    </CustomPageWrapper>
  );
}
