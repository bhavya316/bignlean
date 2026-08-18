"use client";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import ContactCard from "./ContactCard";

export default function page() {
  return (
    <CustomPageWrapper heading="Terms and Conditions">
      <ContactCard
        heading="Introduction"
        paragraph={`Welcome to Bignlean.com where we strive to provide an exceptional online shopping experience. These Terms and Conditions ("Agreement") govern your use of our website, services, and products offered through Bignlean.com Website & Application. By accessing or using our Services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access our Services. Please carefully read and understand the following terms before using our platform. Your access and continued use of our Services indicate your acceptance and acknowledgment of these terms.`}
      />
      
      <ContactCard
        heading="About Offered"
        paragraph={`Bignlean.com is an online marketplace dedicated to providing a wide range of products Such as bodybuilding Health & Supplement Including Sports accessories to our valued customers. Through our platform, we connect buyers and sellers, facilitating transactions in a secure and user-friendly environment.`}
      />

      <ContactCard
        heading="Purpose of Terms and Conditions"
        paragraph={`These Terms and Conditions outline the rules and regulations for the use of Bignlean.com They aim to establish a fair and transparent relationship between us and users, ensuring a safe, efficient, and enjoyable experience for all parties involved.`}
      />

      <ContactCard
        heading="Agreement Updates"
        paragraph={`We reserve the right to modify, update, or revise these terms at our discretion. Any changes will be effective immediately upon posting on our website. It is your responsibility to review these terms periodically for updates. Continued use of our Services after modifications constitutes acceptance of the updated terms.`}
      />

      <ContactCard
        heading="Contact Information"
        paragraph={`If you have any questions, concerns, or require further information regarding these Terms and Conditions, please contact us at support@bignlean.com or 1800-266-133`}
      />

      <ContactCard
        heading="Acceptance of Terms"
        paragraph={<>By accessing or using Bignlean.com ("www.bignlean.com") or any of its services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should refrain from using the Website or its services.<br/><br/>Your access and continued use of the Website constitute your acceptance of these terms, including any future modifications that may be made to these terms. It is your responsibility to review these terms periodically for updates or changes.<br/><br/>If you are using the Website on behalf of an organization or entity, you represent and warrant that you have the authority to bind that entity to these terms.</>}
      />

      <ContactCard
        heading="Eligibility"
        paragraph={`By agreeing to these terms, you affirm that you are at least 18 years old or have reached the age of majority in your jurisdiction. If you are accessing the Website on behalf of a minor, you agree to assume full responsibility for their use of the Website.`}
      />

      <ContactCard
        heading="User Consent to Receive Communications"
        paragraph={`By using the Website, you consent to receive electronic communications from us, such as newsletters, promotional emails, or notifications regarding your account. You agree that all notices, disclosures, agreements, and other communications provided to you electronically satisfy any legal requirement that such communications be in writing.`}
      />

      <ContactCard
        heading="Changes to Terms"
        paragraph={`Bignlean.com reserves the right to modify, update, or revise these Terms and Conditions at any time without prior notice. Any changes will be effective immediately upon posting on the Website. Your continued use of the Website after the posting of modifications constitutes acceptance of the updated terms.`}
      />

      <ContactCard
        heading="User Accounts"
        unorderList={[
          { heading: "Registration and Account Creation: To access certain features of Bignlean.com you may be required to create an account. When creating an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." },
          { heading: "Account Security: You are solely responsible for maintaining the security of your account and password. You agree to notify Bignlean.comimmediately of any unauthorized use of your account or any other breach of security. Bignlean.com will not be liable for any loss or damage arising from your failure to protect your account information adequately." },
          { heading: "Account Termination: Bignlean.com reserves the right to suspend, terminate, or restrict access to your account at its discretion, without prior notice, if it believes that you have violated these Terms and Conditions or for any other reason deemed necessary for the security or integrity of the platform." },
          { heading: "Account Usage: Your account on Bignlean.com is for your personal use only. You agree not to share your account credentials or permit others to access your account. You are responsible for all activities that occur under your account, including any content posted, actions taken, or purchases made." },
          { heading: "Account Deletion: If you wish to delete your account, please contact Bignlean.com through the provided contact information. Note that certain information may be retained as required by law or for legitimate business purposes, even after account deletion." }
        ]}
      />

      <ContactCard
        heading="Product Listings and Sales"
        unorderList={[
          { heading: "Product Descriptions and Availability: Bignlean.com aims to provide accurate and up-to-date information regarding products or services listed on the website. However, we do not warrant that product descriptions, images, pricing, or other content on the site are entirely accurate, complete, reliable, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice." },
          { heading: "Pricing and Payment: Pricing: All prices listed on the website are in Indian Rupees and are subject to change without notice. Prices may not include shipping, handling, taxes, or other applicable fees, which will be added to your total purchase cost where applicable. Payment: Payment for products or services is due at the time of purchase. We accept various payment methods as indicated on the website. By providing your payment information, you authorize us to process and complete your transaction." },
          { heading: "Order Acceptance and Fulfillment: Order Confirmation: After placing an order, you will receive an email confirming the receipt of your order. This confirmation does not constitute acceptance of your order, and we reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase. Order Fulfillment: We will make reasonable efforts to fulfill and ship accepted orders promptly. However, delivery times may vary depending on product availability, shipping method, and destination also weather condition or any political affairs state by state." },
          { heading: "Returns, Refunds, and Exchanges: Return Policy: Bignlean.com has a return policy that outlines the procedures for returns, refunds, and exchanges. Please refer to our Return Policy www.bignlean.com/refund&return for detailed information regarding eligibility, conditions, and instructions for returning products. Refunds: Refunds will be issued in accordance with our Return Policy and may be subject to certain deductions or fees as specified in the policy." },
          { heading: "Product Liability: Bignlean.com is not liable for any damages, losses, or injuries arising from the use or misuse of products or services purchased through the website. Any product liability issues should be addressed directly with the manufacturer or seller of the product." }
        ]}
      />

      <ContactCard
        heading="Shipping and Delivery"
        unorderList={[
          { heading: "Shipping Methods and Costs: Shipping Options: Bignlean.com offers various shipping methods and carriers. The available options, along with associated costs, will be displayed during the checkout process. Shipping Charges: Shipping costs are calculated based on factors such as the shipping destination, selected shipping method, package weight, and dimensions." },
          { heading: "Delivery Timelines and Restrictions: Delivery Times: Estimated delivery times are provided for informational purposes and are not guaranteed. Actual delivery times may vary depending on factors beyond our control, such as carrier delays, weather conditions, or unforeseen circumstances. Delivery Restrictions: We may not be able to ship to certain locations due to legal restrictions, remote areas, or other limitations. If your delivery address falls under such constraints, we will notify you and may cancel the order." },
          { heading: "Tracking Orders: Order Tracking: Upon shipment, you will receive a tracking number or link to track your order's delivery status. You can use this information to monitor the progress of your package. Delivery Notifications: We may send notifications or updates regarding your order status, such as confirmation of shipment or delivery delays, through email or other communication channels provided during the ordering process." },
          { heading: "Lost or Damaged Shipments: Lost Shipments: In the event of a lost shipment, please contact us promptly. We will work with the carrier to initiate an investigation and assist in resolving the issue. Damaged Shipments: If your order arrives damaged, please notify us immediately. Retain all packaging materials and documentation Such as complete video evidence for inspection purposes, as this will facilitate the claims process with the carrier." },
          { heading: "International Shipping: International Orders: For orders shipped internationally, additional fees such as customs duties, taxes, or import charges may apply. These fees are the responsibility of the recipient and are not included in the product price or shipping cost. Customs Regulations: International shipments may be subject to customs clearance procedures and regulations, which can cause delays beyond the estimated delivery times." },
          { heading: "Shipping Liability: Bignlean.com is not liable for shipping delays, errors, or issues caused by carriers or circumstances beyond our control once the package has been handed over to the shipping carrier." }
        ]}
      />

      <ContactCard
        heading="Intellectual Property Rights"
        unorderList={[
          { heading: "Ownership of Content: Platform Content: All content, including but not limited to text, images, logos, graphics, videos, software, and any other materials available on Bignlean.com are owned or licensed by Bignlean.com and are protected by intellectual property laws, including copyright, trademark, and other proprietary rights." },
          { heading: "User-Generated Content: License to Use: By submitting or posting any content (reviews, comments, images, etc.) on Bignlean.com you grant Bignlean.com a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, distribute, and display such content worldwide in any media. User Representations: You represent and warrant that you own or have the necessary rights, licenses, or permissions to post the content you submit and that the content does not infringe upon any third-party rights." },
          { heading: "Trademarks and Copyrights: Trademarks: The trademarks, service marks, and logos displayed on the platform are registered and unregistered trademarks of Bignlean.com or third parties. You are prohibited from using these Marks without prior written consent from the respective owner. Copyrights: All copyrighted material on the platform, unless otherwise stated, is the property of Bignlean.com or its licensors and is protected by copyright laws. Unauthorized use of copyrighted material is strictly prohibited." },
          { heading: "DMCA Compliance: Notice and Takedown: Bignlean.com complies with the Digital Millennium Copyright Act (DMCA). If you believe that any content on the platform infringes upon your copyright, please provide us with a notice containing specific information outlined in the DMCA for prompt removal or disabling of the infringing content." },
          { heading: "Third-Party Content: Third-Party Rights: Content provided by third parties, such as product descriptions or user reviews, is the sole responsibility of the respective third party. Bignlean.com does not endorse or guarantee the accuracy, integrity, or quality of such content." }
        ]}
      />

      <ContactCard
        heading="Privacy Policy"
        unorderList={[
          { heading: "Information Collection: Personal Information: When you use Bignlean.com, we may collect personal information such as your name, email address, shipping address, payment details, and contact information. This information is collected when you create an account, place an order, or interact with our platform. Automatically Collected Information: We may also collect non-personal information automatically, including IP addresses, device information, browsing history, and cookies, to enhance user experience, analytics, and marketing purposes." },
          { heading: "Use of Information: Order Processing: We use the collected information to process orders, provide customer support, and deliver products or services purchased through the platform. Communication: We may use your contact information to communicate with you about your orders, updates, promotions, or important notices related to the platform. Personalization: Information collected may be used to personalize your experience on the platform, such as recommending products or services based on your preferences." },
          { heading: "Information Sharing: Third-Party Service Providers: We may share certain information with trusted third-party service providers (e.g., payment processors, shipping companies) to facilitate services on our behalf. These third parties are obligated to maintain the confidentiality of your information. Legal Compliance: We may disclose information in response to lawful requests by public authorities or to comply with legal obligations, protect our rights, or ensure the safety of users" },
          { heading: "Data Security: Security Measures: Bignlean.com implements appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. User Responsibility: While we strive to protect your data, please note that no method of transmission over the internet or electronic storage is completely secure. Users also play a role in maintaining the security of their account information." },
          { heading: "Your Choices: Account Information: You can review and update your account information by logging into your account settings. Marketing Communications: You may opt-out of receiving marketing communications from us by following the instructions provided in the communication or by contacting us directly" },
          { heading: "Policy Changes: Updates to the Privacy Policy: We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with a revised effective date. Your continued use of the platform after changes indicate your acceptance of the updated Privacy Policy." },
          { heading: "Contact Information: If you have any questions or concerns about our Privacy Policy or the handling of your personal information, please contact us at support@bignlean.com or 1800-266-1313." }
        ]}
      />

      <ContactCard
        heading="User Conduct and Responsibilities"
        unorderList={[
          { heading: "Lawful Use of the Platform: Compliance with Laws: Users must abide by all applicable local, national, and international laws and regulations when using Bignlean.com This includes but is not limited to laws related to intellectual property rights, data privacy, and prohibited content. Prohibited Activities: Users are prohibited from engaging in any activity that may violate the rights of others, cause harm, or disrupt the platform's functionality. This includes but is not limited to: Uploading, posting, or transmitting unauthorized or unlawful content. Attempting to gain unauthorized access to accounts, systems, or networks. Engaging in fraudulent activities or impersonating others." },
          { heading: "User Content and Interactions: Content Guidelines: Users are solely responsible for the content they post, upload, or transmit on the platform. Content must not infringe on the rights of third parties, be misleading, offensive, or illegal. Interactions with Others: Users are expected to interact with other users, sellers, or service providers respectfully and in a lawful manner. Harassment, threats, or abusive behavior towards others is strictly prohibited." },
          { heading: "Account Security and Responsibilities: Account Usage: Users are responsible for maintaining the security of their account credentials and for all activities that occur under their accounts. Unauthorized Access: Users must promptly notify Bignlean.com if they suspect unauthorized access to their account or any other security breach." },
          { heading: "Compliance with Platform Policies: Acceptance of Policies: By using the platform, users agree to abide by the terms and conditions, privacy policy, and any other guidelines or policies provided by Bignlean.com Policy Violations: Bignlean.com reserves the right to investigate and take appropriate action, including account suspension or termination, in cases where users violate the platform's policies or engage in prohibited activities." },
          { heading: "Indemnification: User Liability: Users agree to indemnify and hold harmless [Your Company] from any claims, damages, liabilities, and expenses arising from their use of the platform, violation of terms, or infringement of any rights." },
          { heading: "Termination of Access: Right to Terminate Access: Bignlean.com reserves the right to suspend or terminate a user's access to the platform at its discretion, without prior notice, if the user violates the terms or engages in activities that may harm the platform or its users." }
        ]}
      />

      <ContactCard
        heading="Disclaimers and Limitation of Liability"
        unorderList={[
          { heading: "No Warranty: As-Is Basis: Bignlean.com is provided \"as is\" and \"as available\" without any warranties, representations, or guarantees of any kind, either expressed or implied. Use at Own Risk: Users acknowledge and agree that the use of the platform is at their own risk. Bignlean.com does not warrant that the platform will be uninterrupted, error-free, secure, or meet their requirements." },
          { heading: "Limitation of Liability: Exclusion of Damages: In no event shall Bignlean.com or its affiliates, partners, directors, officers, employees, agents, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, or goodwill. Maximum Liability: The maximum aggregate liability of Bignlean.com for any claims arising out of or related to the use of the platform shall not exceed the amount paid by the user, if any, for accessing or using the services provided by the platform during the preceding 12 months." },
          { heading: "Third-Party Links and Content: Third-Party Responsibility: Bignlean.com may contain links to third-party websites or content. We do not endorse or assume any responsibility for the accuracy or completeness of content provided by third parties. Users access such content at their own risk." },
          { heading: "Indemnification: User Responsibility: Users agree to indemnify and hold harmless Bignlean.com from and against any claims, damages, liabilities, and expenses arising from their use of the platform, violation of terms, or infringement of any rights." },
          { heading: "No Professional Advice: Non-Professional Information: Content provided on Bignlean.com is for informational purposes only and should not be construed as professional advice. Users should seek professional advice relevant to their specific circumstances." },
          { heading: "Jurisdiction Limitations: Local Laws: Bignlean.com makes no representation that the platform is appropriate or available for use in all locations. Users are responsible for complying with local laws and regulations regarding online conduct and access to the platform." }
        ]}
      />

      <ContactCard
        heading="Governing Law and Dispute Resolution"
        unorderList={[
          { heading: "Governing Law: Jurisdiction: These Terms and Conditions and any disputes arising out of or related to the use of Bignlean.com shall be governed by and construed in accordance with the laws of [Jurisdiction/Country], without regard to its conflict of law principles." },
          { heading: "Dispute Resolution: Negotiation: In the event of any dispute, claim, or controversy arising out of or relating to these terms, the parties agree to first attempt to resolve the matter informally by good-faith negotiation. Mediation/Arbitration: If the parties cannot resolve the dispute through negotiation, they agree to seek mediation or arbitration as a next step. Mediation or arbitration will be conducted in [City, State/Country] in accordance with the rules of [Arbitration/Mediation Provider]. Court Proceedings: If mediation or arbitration fails to resolve the dispute, the parties agree that any legal proceedings shall be brought exclusively in the courts located in [City, State/Country], and each party hereby submits to the personal jurisdiction of such courts." },
          { heading: "Class Action Waiver: Class Action Waiver: Users agree that any dispute resolution proceedings will be conducted only on an individual basis and not as a class, consolidated, or representative action." },
          { heading: "Legal Fees: Attorney's Fees: In the event of any legal action arising from or related to these terms, the prevailing party shall be entitled to recover its reasonable attorney's fees, costs, and expenses." },
          { heading: "Severability: Severability Clause: If any provision of this dispute resolution section is found to be unenforceable or invalid, the remaining provisions shall remain in full force and effect." }
        ]}
      />

      <ContactCard
        heading="Changes to Terms and Conditions"
        unorderList={[
          { heading: "Modification Rights: Right to Modify: Bignlean.com reserves the right to modify, update, or revise these Terms and Conditions at any time without prior notice. Any changes will be effective immediately upon posting on Bignlean.com or through other means of communication." },
          { heading: "Notification of Changes: Notice to Users: We will make reasonable efforts to notify users of any material changes to these terms. This may include but is not limited to, sending an email notification, posting a notice on the platform, or highlighting the changes upon login. User Responsibility: It is the user's responsibility to review the Terms and Conditions periodically for updates or changes. Continued use Bignlean.com after modifications indicates acceptance of the updated terms." },
          { heading: "Expressing Disagreement: Opt-Out Option: If a user disagrees with the updated terms, they may discontinue the use of the platform and terminate their account. Continued use of the platform after changes will be considered as acceptance of the modified terms." },
          { heading: "Validity of Previous Versions: Previous Versions: Prior versions of the Terms and Conditions will be archived for reference purposes. The current version supersedes all previous versions." }
        ]}
      />

      <ContactCard
        heading="Miscellaneous"
        unorderList={[
          { heading: "Severability: Severability Clause: If any provision of these terms is found to be unenforceable or invalid, the remaining provisions shall remain in full force and effect." },
          { heading: "Entire Agreement: Entire Agreement Clause: These Terms and Conditions constitute the entire understanding between Bignlean.com and the users, superseding any prior agreements, discussions, or understandings, whether written or oral." },
          { heading: "Assignment: Assignment Clause: Users may not assign, transfer, or sublicense their rights or obligations under these terms to any third party without prior written consent from Bignlean.com. Bignlean.com reserves the right to assign these terms or any rights without user consent." },
          { heading: "Waiver: Waiver Clause: The failure of Bignlean.con to enforce any provision of these terms shall not be considered a waiver of its right to subsequently enforce such provision or any other provision." },
          { heading: "Headings: Headings: The headings used in these terms are for convenience and do not affect the interpretation of the content." },
          { heading: "Contact Information: Contact Details: For inquiries, questions, or support regarding these terms or the services provided by Bignlean.com, users can contact 1800-265-1313" }
        ]}
      />

    </CustomPageWrapper>
  );
}
