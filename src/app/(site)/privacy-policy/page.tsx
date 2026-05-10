"use client";
import { ReactNode } from "react";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import ContactCard from "../terms-and-conditions/ContactCard";

interface HeadingProps {
  content: string;
}

const Heading = ({ content }: HeadingProps) => {
  return (
    <h2 className="text-black text-xl not-italic font-bold mb-3">{content}</h2>
  );
};

export default function Page() {
  return (
    <CustomPageWrapper heading="Privacy Policy">
      <ContactCard
        heading="Privacy Policy"
        paragraph={
          <>
            This Privacy Policy describes how{" "}
            <a
              href="https://bignlean.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Bignlean.com
            </a>{" "}
            ("we," "us," or "our") collects, uses, maintains, and discloses information collected from users ("User" or "you") of our website www.bignlean.com concerning health supplements and sports nutrition products.
          </>
        }
      />
      <Heading content="Information We Collect" />
      <ContactCard
        heading=""
        paragraph={`We may collect personal identification information from Users in various ways, including, but not limited to, when Users visit our Website, register, place an order, subscribe to our newsletter, respond to a survey, fill out a form, or interact with other activities, services, features, or resources we make available. Users may be asked for name, email address, mailing address, phone number, and credit card information. Users may visit our Website anonymously. We collect personal identification information from Users only if they voluntarily submit such information to us.`}
      />
      <Heading content="How We Use Collected Information" />
      <ContactCard
        heading=""
        unorderList={[
          { heading: "To improve customer service: The information you provide helps us respond to your customer service requests and support needs more efficiently." },
          { heading: "To personalize user experience: We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Website." },
          { heading: "To process payments: We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service." },
          { heading: "To send periodic emails: We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests. If User decides to opt-in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. If at any time the User would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email or the User may contact us via our Website." }
        ]}
      />
      <Heading content="How We Protect Your Information" />
      <ContactCard
        heading=""
        paragraph={`We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Website.`}
      />
      <Heading content="Sharing Your Personal Information" />
      <ContactCard
        heading=""
        paragraph={`We do not sell, trade, or rent Users' personal identification information to others. We may use third-party service providers to help us operate our business and the Website or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.`}
      />
      <Heading content="Changes to This Privacy Policy" />
      <ContactCard
        heading=""
        paragraph={`We have the discretion to update this Privacy Policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this Privacy Policy periodically and become aware of modifications.`}
      />
      <Heading content="Your Acceptance of These Terms" />
      <ContactCard
        heading=""
        paragraph={`By using this Website, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Website. Your continued use of the Website following the posting of changes to this policy will be deemed your acceptance of those changes.`}
      />
      <Heading content="Information We Collect Through Your Use" />
      <ContactCard
        heading=""
        paragraph={
          <>
            When you use our Services, we collect information about you in the following general categories:
            <ul className="mt-3 space-y-2">
              <li>
                <span className="font-bold text-black">Location Information:</span> We collect precise location data (GPS and network-based) if you permit the Bignlean.com app/website to access location services. We may also derive your approximate location from your IP address.
              </li>
              <li>
                <span className="font-bold text-black">Contacts Information:</span> If you permit, we may access and store names and contact information from your address book to facilitate social interactions through our Services.
              </li>
              <li>
                <span className="font-bold text-black">Transaction Information:</span> We collect transaction details related to your use of our Services, including the type of service requested, the date and time, the amount charged, and other related transaction details.
              </li>
              <li>
                <span className="font-bold text-black">Usage and Preference Information:</span> We collect information about how you and site visitors interact with our Services, preferences expressed, and settings chosen. In some cases, we do this through cookies and similar technologies.
              </li>
              <li>
                <span className="font-bold text-black">Device Information:</span> We may collect information about your mobile device, including hardware model, operating system and version, software and file names and versions, preferred language, unique device identifier, advertising identifiers, serial number, device motion information, and mobile network information.
              </li>
              <li>
                <span className="font-bold text-black">Call and SMS Data:</span> Our app/website facilitates communication between Users and Customer Support. In connection with this service, we receive call data, including the date and time of the call or SMS message, the parties' phone numbers, and the content of the SMS message and sending OTP(s).
              </li>
              <li>
                <span className="font-bold text-black">Log Information:</span> We collect server logs, which may include information like device IP address, access dates and times, app features or pages viewed, app crashes and other system activity, type of browser, and the third-party site or service you were using before interacting with our Services.
              </li>
            </ul>
          </>
        }
      />
      <Heading content="Social Sharing Features" />
      <ContactCard
        heading=""
        paragraph={`The Services may integrate with social sharing features and other related tools that let you share actions you take on our Services with other apps, sites, or media, and vice versa. Your use of such features enables the sharing of information with your friends or the public, depending on the settings you establish with the social sharing service. Please refer to the privacy policies for more information about how they handle the data you provide to or share through them.`}
      />
      <Heading content="Analytics and Advertising Services Provided by Others" />
      <ContactCard
        heading=""
        paragraph={`We may allow others to provide audience measurement and analytics services for us, to serve advertisements on our behalf across the Internet, and to track and report on the performance of those advertisements. These entities may use cookies and other technologies to identify your device when you visit our app/website and use our Services, as well as when you visit other online sites and services.`}
      />
      <Heading content="Your Choices" />
      <ContactCard
        heading=""
        unorderList={[
          { heading: "Account Information: You may correct your account information at any time by logging into your online or in-app account. In some cases, we may retain certain information about you as required by law, or for legitimate business purposes." },
          { heading: "Access Rights: Bignlean.com will comply with individual requests regarding access, correction, and/or deletion of the personal data it stores in accordance with applicable law. You can write to us at support@bignlean.com or call our Toll-Free Number - 1800-266-1313." },
          { heading: "Location Information: We request permission for our app's collection of precise locations from your device per the permission system used by your mobile operating system." },
          { heading: "Contact Information: We may also seek permission for our app's collection and syncing of contact information from your device per the permission system used by your mobile operating system." },
          { heading: "Promotional Communications: You may opt out of receiving promotional messages from us by following the instructions in those messages. If you opt-out, we may still send you non-promotional communications, such as those about your account or our ongoing business relations." }
        ]}
      />
      <Heading content="Promotional Communication Through WhatsApp Messenger" />
      <ContactCard
        heading=""
        paragraph={`By opting in/accepting the terms and conditions, you give consent to Bignlean.com to communicate with you on WhatsApp for all its transactional and promotional messages/communication needs. We shall store your details responsibly and use them to enrich your experience with us & provide the best deals & discounts.`}
      />
      <Heading content="Changes to the Statement" />
      <ContactCard
        heading=""
        paragraph={`We may change this Statement from time to time. If we make significant changes in the way we treat your personal information, or to the Statement, we will provide you notice through the Services or by some other means, such as email. Your continued use of the Services after such notice constitutes your consent to the changes. We encourage you to periodically review the Statement for the latest information on our privacy practices.`}
      />
      <Heading content="Contacting Us" />
      <ContactCard
        heading=""
        paragraph={`If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at: support@bignlean.com`}
      />
    </CustomPageWrapper>
  );
}
