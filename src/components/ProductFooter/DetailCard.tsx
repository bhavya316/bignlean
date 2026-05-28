/* eslint-disable @next/next/no-img-element */
import { OutlinedButton } from "..";

export default function DetailCard({
  details,
  information,
  supplements,
}: {
  details: any;
  information: any;
  supplements: any;
}) {
  const safeDetails = Array.isArray(details) ? details : [];

  return (
    <div>
      <h2 className="text-black text-base not-italic font-bold mb-3">
        Details
      </h2>
      <div className="border-[1px] p-4 rounded-lg border-gray-300">
        <div className="flex flex-col gap-5">
          {safeDetails.map((detail: any, index: number) => (
            <div key={index}>
              <h3 className="text-black text-lg not-italic font-bold mb-3">
                {detail?.heading}
              </h3>
              <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
                {detail?.body}
              </p>
            </div>
          ))}
          <InformationCard information={information} />
          <SuplimemntsCard supplements={supplements} />
        </div>
      </div>
    </div>
  );
}

const SuplimemntsCard = ({ supplements }: { supplements: any }) => {
  const safeSupplements = Array.isArray(supplements)
    ? supplements.filter(Boolean)
    : [];

  if (safeSupplements.length === 0) return null;

  return (
    <div>
      <h3 className="text-black text-lg not-italic font-bold mb-3">
        Supplements
      </h3>
      <div className="flex items-center flex-wrap gap-5">
        {safeSupplements.map((item: any, index: number) => (
          <div key={index} className="w-[150px] ">
            <img src={item} alt="supliment" className="w-full max-h-[150px] object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
};

const InformationCard = ({ information }: { information: any }) => {
  const safeInformation = Array.isArray(information)
    ? information.filter((info: any) => info?.title || Array.isArray(info?.table))
    : [];

  if (safeInformation.length === 0) return null;

  return (
    <div>
      <h3 className="text-black text-lg not-italic font-bold mb-3">
        Information
      </h3>
      <div className="custom-grid3">
        {safeInformation.map((info: any, index: number) => (
          <InfoCard key={index} info={info} />
        ))}
      </div>
    </div>
  );
};

const InfoCard = ({ info }: { info: any }) => {
  return (
    <div>
      <h3 className="text-black text-sm not-italic font-semibold p-3 bg-gray-200 rounded-lg">
        {info?.title}
      </h3>
      <div className="p-2 flex flex-col gap-2">
        {info?.table?.map((item: any, index: number) => (
          <p
            key={index}
            className="flex items-center justify-between text-black text-center text-sm not-italic font-normal"
          >
            <span>{item?.for}</span>
            <span>{item?.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

const FaqCard = () => {
  return (
    <div>
      <h3 className="text-black text-lg not-italic font-bold mb-3">
        FAQs Related to ON Whey Double Rich Chocolate 5lbs
      </h3>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-black text-base not-italic font-bold">
            Q1. Is Double Rich Chocolate 5lbs ON Whey Protein safe for
            consumption?
          </p>
          <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
            Ans: Yes. Optimum Nutrition provides complete transparency of its
            nutritional sources. It is tested regularly for banned substances
            and is suitable for daily consumption.
          </p>
        </div>
        <div>
          <p className="text-black text-base not-italic font-bold">
            Q2. What is the ON Whey Protein 5 Ibs Price for 1 kilo?
          </p>
          <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
            Ans: The price of 1 kilo of ON Whey Protein Double rich chocolate is
            around Rs. 3215.
          </p>
        </div>
        <div>
          <p className="text-black text-base not-italic font-bold">
            Q3. Who should use this supplement?
          </p>
          <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
            Ans: This supplement is designed for fitness enthusiasts,
            bodybuilders and sportspersons to get their daily required protein
            for faster recovery and muscle development.
          </p>
        </div>
        <div>
          <p className="text-black text-base not-italic font-bold">
            Q4. How to use ON Whey Double Rich Chocolate 5lbs?
          </p>
          <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
            Ans: Mix one level scoop of ON Whey Double Rich Chocolate 5lbs with
            180-240 ml of water or milk to make a thick and tasty beverage.
          </p>
        </div>
      </div>
    </div>
  );
};

const GoldStandardCard = () => {
  return (
    <div>
      <h3 className="text-black text-lg not-italic font-bold mb-3">
        Why to Buy ON Gold Standard 5lbs Double Rich Chocolate
      </h3>
      <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
        If you want to improve your sports and athletic performance, then ON
        Gold Standard 5lbs Double Rich Chocolate is a great addition to your
        diet. For those who are unable to get their daily required protein
        intake either due to food preferences or other reasons, this supplement
        provides a reliable and authentic source of good nutrition.
      </p>
    </div>
  );
};

const PrecautionCard = () => {
  return (
    <div>
      <h3 className="text-black text-lg not-italic font-bold mb-3">
        Precautions To Take When Consuming
      </h3>
      <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
        Some precautions to take when using Slbs on Whey Protein Double Rich
        Chocolate are as follows: Those who are lactose intolerant should avoid
        this as whey proteins are derived from milk. Make sure that you do not
        exceed the recommended dosage as protein strains your liver and kidneys.
      </p>
      <p className="text-black text-sm not-italic font-normal leading-6">
        A protein supplement like ON Whey Protein 5Ibs Double Rich Chocolate
        should be used along with a healthy diet and must become a substitute
        for your regular meals.
      </p>
    </div>
  );
};

const NutCard = () => {
  return (
    <div>
      <h2 className="text-black text-lg not-italic font-bold mb-2">
        Nutrition Facts for ON Whey Gold Standard 5lbs Double Rich chocolate
      </h2>
      <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
        The value for ON Whey Protein 5 Ibs Price comes from the rich
        nutritional profile which includes:
      </p>
      <ul className="w-[30%]">
        <li className="flex justify-between text-black text-sm not-italic font-bold">
          <span>Nutrients</span>
          <span>Nutrition Value</span>
        </li>
        <li className="text-black text-sm not-italic font-normal flex justify-between">
          <span>Energy</span>
          <span>117kcal</span>
        </li>
        <li className="flex justify-between text-black text-sm not-italic font-normal">
          <span>Protein</span>
          <span>244g</span>
        </li>
        <li className="flex justify-between text-black text-sm not-italic font-normal">
          <span>Carbohydrates</span>
          <span>3g</span>
        </li>
        <li className="flex justify-between text-black text-sm not-italic font-normal">
          <span>Sugar</span>
          <span>1g</span>
        </li>
        <li className="flex justify-between text-black text-sm not-italic font-normal">
          <span>Fat</span>
          <span>1g</span>
        </li>
        <li className="flex justify-between text-black text-sm not-italic font-normal">
          <span>Cholesterol</span>
          <span>45mg</span>
        </li>
      </ul>
    </div>
  );
};

const ConsumeCard = () => {
  return (
    <div>
      <h2 className="text-black text-lg not-italic font-bold mb-2">
        When to Consume On Gold Standard Double Rich Chocolate 5Ibs
      </h2>
      <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
        You can consume between 1-3 servings of ON Whey Double Rich Chocolate
        5lbs each day. The timings may vary as per your requirements. The best
        options are:
      </p>
      <ul className="pl-4    list-disc flex flex-col gap-3">
        <li className="text-black text-sm not-italic font-normal   leading-6">
          Right after a workout to help you recover faster
        </li>
        <li className="text-black text-sm not-italic font-normal   leading-6">
          In between your meals as a shack to prevent muscle loss
        </li>
        <li className="text-black text-sm not-italic font-normal   leading-6">
          First thing in the morning to recover from long interval without a
          meal
        </li>
      </ul>
    </div>
  );
};

const BenefitsCard = () => {
  return (
    <div>
      <h2 className="text-black text-lg not-italic font-bold mb-2">
        Health Benefits of ON Double Rich Chocolate 5lbs
      </h2>
      <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
        ON Double Rich Chocolate 5Ibs is the best support for a rigorous and
        intense training regime as it provides the following health benefits:
      </p>
      <ul className="pl-4    list-disc flex flex-col gap-3">
        <li className="text-black text-sm not-italic font-normal   leading-6">
          <span>Improved protein consumption for muscle recovery:</span> With
          every serving of ON whey protein, you get 24g of protein blends. The
          fast-acting proteins, namely the whey protein isolates and
          hydrolysates are absorbed instantly after training. This replenishes
          the amino acids which you lose when you workout or engage in any
          strenuous physical activity. Gold Standard Whey Protein 2.27 kg Double
          Rich Chocolate also contains important amino acids like BCAAs,
          Glutamine and Glutamic Acid which are readily absorbed by the muscles
          to help them recover faster
        </li>
        <li className="text-black text-sm not-italic font-normal leading-6">
          <span>Helps retain muscle tone:</span>
          Whey concentrate, which is included in the formula, is a
          slow-digesting protein. It releases amino acids slowly into your
          system, helping your muscles when there are long intervals between
          meals. Muscle loss is an issue which keeps you from reaching your
          goals and delays progress. ON Gold Standard Whey 2.27 kg Double Rich
          Chocolate is also one of the best snack options as it gives you the
          necessary boost of amino acids to prevent your muscles from breaking
          down.
        </li>
        <li className="text-black text-sm not-italic font-normal leading-6">
          <span>Helps you lose weight:</span>
          Weight loss is the result of increased protein consumption and
          improved sports performance. Protein keeps you feeling fuller for
          longer and helps manage food cravings better. With better stamina and
          ability to train, you are also able to push yourself harder at the
          gym. The most important advantage for weight loss is the increase in
          calorie consumption when you increase your protein consumption.
          Protein is harder to digest and requires more calories.
        </li>
        <li className="text-black text-sm not-italic font-normal leading-6">
          <span>Strengthens immune response:</span>
          Bodybuilders and fitness enthusiasts often suffer from the issue of
          compromised immunity. This is because of the wear and tear that their
          muscles undergo which may lead to some inflammation, redirecting the
          immune response. With ON Whey 5Ibs Double Rich Chocolate you have the
          dual benefits of faster muscle recovery and higher protein
          consumption. This protein powder helps in the restoration of the
          immune cells and boosts the production of antibodies which keep safe
          from common health issues.
        </li>
      </ul>
    </div>
  );
};

const OtherInformation = () => {
  return (
    <div>
      <h3 className="text-black text-lg not-italic font-bold mb-3">
        Other Information
      </h3>
      <p className="text-black text-sm not-italic font-normal mb-4  leading-6">
        Optimum Nutrition is a trusted brand which has a legacy of over 30
        years. They have made their mark in the fitness and nutrition industry
        in more than 90 countries. Double Rich Chocolate 5lbs ON Whey Protein is
        among the top-selling protein supplements in their range because it
        caters to multiple needs including muscle maintenance and growth.
      </p>
      <p className="text-black text-sm not-italic font-normal leading-6">
        Whey proteins are derived from milk and have grown in popularity because
        they are easy for the body to absorb. You have three primary varieties
        including whey protein concentrates, whey isolates and whey
        hydrolysates. They differ in the protein concentration and rate of
        absorption. ON Double Rich Chocolate 5Ibs uses all three to give you the
        option of proteins that are absorbed instantly and those that provide a
        sustained supply of amino acids.
      </p>
    </div>
  );
};

const AboutProduct = () => {
  return (
    <div>
      <h3 className="text-black text-base not-italic font-semibold mb-3">
        About the product
      </h3>
      <ul className="pl-4    list-disc flex flex-col gap-3">
        <li className="text-black text-sm not-italic font-normal">
          Gold Standard 100% Whey Blend - 24g blended protein consisting of whey
          protein isolate, whey protein concentrate, and whey
          peptides/hydrolysates to support muscle recovery. Primary protein
          source is Isolate, they don't call it the Gold Standard of quality for
          nothing.
        </li>
        <li className="text-black text-sm not-italic font-normal">
          What Does It Have -11 grams of naturally occurring EAAs, including 5.5
          grams of naturally occurring BCAAs, and over 4 grams of naturally
          occurring Glutamine and Glutamic Acid in each serving to support
          endurance and muscle recovery. Gluten-Free & suitable for Vegetarians
        </li>
        <li className="text-black text-sm not-italic font-normal">
          SMS ON 6 digit unique code on the pack to 57575 or visit our website
          Authenticateon.in to instantly check the authenticity of the product
        </li>
        <li className="text-black text-sm not-italic font-normal">
          Country of Origin: India, it is manufactured in India, in a facility
          that is ISO 14001 & 22000 certified and inspected & Approved by Food
          Safety Standard Authority of India. Whey Imported from Europe.
          Manufactured for OPTIMUM NUTRITION, INC. By Tirupati Wellness Pvt Ltd,
          Surajpur, Nahan Road, Paonta Sahib Dist. Sirmour- 173025 (HP)
        </li>
      </ul>
    </div>
  );
};
