import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import Accordian from "../app-certificates/Accordian";
import { SideArrowIcon } from "@/Icons";
import { ApiPaths } from "@/constants";
import { Faq } from "@/utils/Schemas";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BASE_URL ||
  "http://localhost:3002";

async function getAllFaqs() {
  try {
    const res = await fetch(baseUrl + ApiPaths.FAQS, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data?.faqs || {};
  } catch (error) {
    console.error("Fetch FAQs failed:", error);
    return {};
  }
}

function getObjectKeys(obj: any) {
  return Object.keys(obj);
}
export default async function page() {
  const allFaq = await getAllFaqs();
  const sidebarData = getObjectKeys(allFaq);
  return (
    <CustomPageWrapper>
      <div className="flex gap-10 max-[1000px]:flex-col">
        <div className="flex-[0.3] max-[1000px]:hidden">
          <div className="flex flex-col gap-5 bg-white sm-3 rounded-xl p-4">
            {sidebarData?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between cursor-pointer"
              >
                <p>{item}</p>
                <SideArrowIcon />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-[0.7]">
          {sidebarData.length === 0 && (
            <div className="text-gray-500">No FAQs found.</div>
          )}
          {sidebarData &&
            sidebarData?.length > 0 &&
            sidebarData.map((key: string) => (
              <div key={key}>
                <h2 className="text-black text-lg not-italic font-bold mb-5 mt-5 font-poppins">
                  {key}
                </h2>
                <div className="flex  flex-col gap-4 font-poppins text-black">
                  {allFaq[key].map((faq: Faq) => (
                    <Accordian
                      heading={faq?.question}
                      para={faq?.answer}
                      key={faq?.id}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </CustomPageWrapper>
  );
}
