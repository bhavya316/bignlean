"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const FooterButtons = [
  {
    activeIcon: <ActiveHomeIcon />,
    inActiveicon: <HomeIcon />,
    isActive: true,
    route: "/",
  },
  {
    activeIcon: <ActiveCategoryIcon />,
    inActiveicon: <CategoryIcon />,
    isActive: false,
    route: "/products/categories",
  },
  {
    activeIcon: <WishlistIcon />,
    inActiveicon: <WishlistIcon />,
    isActive: false,
    route: "/wishlist",
  },
  {
    activeIcon: <ProfileIcon />,
    inActiveicon: <ProfileIcon />,
    isActive: false,
    route: "/profile",
  },
];

export default function MobileFooter() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="hidden max-[750px]:block fixed bottom-0 left-0 w-full sm-2 h-[70px] bg-white z-[9999]">
      <div className="w-[500px] max-[500px]:w-full mx-auto h-full flex items-stretch justify-between px-2">
        {FooterButtons.map((button, index) => (
          <FooterButton
            onClick={() => router.push(button.route)}
            key={index}
            activeIcon={button.activeIcon}
            inActiveIcon={button?.inActiveicon}
            isActive={Boolean(button.route === pathname)}
          />
        ))}
      </div>
    </div>
  );
}

const FooterButton = ({
  activeIcon,
  inActiveIcon,
  isActive,
  onClick,
}: {
  activeIcon: ReactNode;
  inActiveIcon: ReactNode;
  isActive: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="h-full flex flex-col justify-between w-[50px] items-center pt-5 cursor-pointer"
    >
      <div className="scale-125">{isActive ? activeIcon : inActiveIcon}</div>
      {isActive && (
        <div className="w-full h-2 rounded-tl-lg rounded-tr-lg linear-gradient-1"></div>
      )}
    </div>
  );
};

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
    >
      <g opacity="0.2">
        <path
          d="M15.75 7C15.75 8.79493 14.2949 10.25 12.5 10.25V11.75C15.1234 11.75 17.25 9.62335 17.25 7H15.75ZM12.5 10.25C10.7051 10.25 9.25 8.79493 9.25 7H7.75C7.75 9.62335 9.87665 11.75 12.5 11.75V10.25ZM9.25 7C9.25 5.20507 10.7051 3.75 12.5 3.75V2.25C9.87665 2.25 7.75 4.37665 7.75 7H9.25ZM12.5 3.75C14.2949 3.75 15.75 5.20507 15.75 7H17.25C17.25 4.37665 15.1234 2.25 12.5 2.25V3.75ZM18.75 17.5C18.75 18.0294 18.3014 18.7105 17.1143 19.3041C15.9722 19.8751 14.3418 20.25 12.5 20.25V21.75C14.5242 21.75 16.3938 21.3414 17.7852 20.6457C19.1316 19.9725 20.25 18.9036 20.25 17.5H18.75ZM12.5 20.25C10.6582 20.25 9.02782 19.8751 7.88566 19.3041C6.69864 18.7105 6.25 18.0294 6.25 17.5H4.75C4.75 18.9036 5.86836 19.9725 7.21484 20.6457C8.60618 21.3414 10.4758 21.75 12.5 21.75V20.25ZM6.25 17.5C6.25 16.9706 6.69864 16.2895 7.88566 15.6959C9.02782 15.1249 10.6582 14.75 12.5 14.75V13.25C10.4758 13.25 8.60618 13.6586 7.21484 14.3543C5.86836 15.0275 4.75 16.0964 4.75 17.5H6.25ZM12.5 14.75C14.3418 14.75 15.9722 15.1249 17.1143 15.6959C18.3014 16.2895 18.75 16.9706 18.75 17.5H20.25C20.25 16.0964 19.1316 15.0275 17.7852 14.3543C16.3938 13.6586 14.5242 13.25 12.5 13.25V14.75Z"
          fill="black"
        />
      </g>
    </svg>
  );
}

function ActiveHomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.5 10.1503V17.9668C21.5 20.1943 19.7091 22 17.5 22H7.5C5.29086 22 3.5 20.1943 3.5 17.9668V10.1503C3.5 8.93937 4.03964 7.7925 4.96986 7.02652L9.96986 2.90935C11.4423 1.69689 13.5577 1.69688 15.0301 2.90935L20.0301 7.02652C20.9604 7.7925 21.5 8.93937 21.5 10.1503ZM10.5 17.25C10.0858 17.25 9.75 17.5858 9.75 18C9.75 18.4142 10.0858 18.75 10.5 18.75H14.5C14.9142 18.75 15.25 18.4142 15.25 18C15.25 17.5858 14.9142 17.25 14.5 17.25H10.5Z"
        fill="url(#paint0_linear_2611_551)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2611_551"
          x1="3.5"
          y1={12}
          x2="21.5"
          y2={12}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E70F0F" />
          <stop offset={1} stopColor="#FF5F5F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
    >
      <path
        d="M21.5 17.9668V10.1503C21.5 8.93937 20.9604 7.7925 20.0301 7.02652L15.0301 2.90935C13.5577 1.69688 11.4423 1.69689 9.96986 2.90935L4.96986 7.02652C4.03964 7.7925 3.5 8.93937 3.5 10.1503V17.9668C3.5 20.1943 5.29086 22 7.5 22H17.5C19.7091 22 21.5 20.1943 21.5 17.9668Z"
        stroke="#CCCCCC"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 18H14.5"
        stroke="#CCCCCC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActiveCategoryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M16.1541 0H13.0772C11.8047 0 10.7695 1.03521 10.7695 2.30769V6.92308C10.7695 8.19556 11.8047 9.23077 13.0772 9.23077H17.6926C18.9651 9.23077 20.0003 8.19556 20.0003 6.92308V3.84615C20.0003 1.72563 18.2747 0 16.1541 0Z"
        fill="url(#paint0_linear_2611_2203)"
      />
      <path
        d="M6.92308 0H3.84615C1.72563 0 0 1.72563 0 3.84615V6.92308C0 8.19556 1.03521 9.23077 2.30769 9.23077H6.92308C8.19556 9.23077 9.23077 8.19556 9.23077 6.92308V2.30769C9.23077 1.03521 8.19556 0 6.92308 0Z"
        fill="url(#paint1_linear_2611_2203)"
      />
      <path
        d="M17.6926 10.7693H13.0772C11.8047 10.7693 10.7695 11.8045 10.7695 13.077V17.6924C10.7695 18.9648 11.8047 20.0001 13.0772 20.0001H16.1541C18.2747 20.0001 20.0003 18.2744 20.0003 16.1539V13.077C20.0003 11.8045 18.9651 10.7693 17.6926 10.7693Z"
        fill="url(#paint2_linear_2611_2203)"
      />
      <path
        d="M6.92308 10.7693H2.30769C1.03521 10.7693 0 11.8045 0 13.077V16.1539C0 18.2744 1.72563 20.0001 3.84615 20.0001H6.92308C8.19556 20.0001 9.23077 18.9648 9.23077 17.6924V13.077C9.23077 11.8045 8.19556 10.7693 6.92308 10.7693Z"
        fill="url(#paint3_linear_2611_2203)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2611_2203"
          x1="10.7695"
          y1="4.61538"
          x2="20.0003"
          y2="4.61538"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E70F0F" />
          <stop offset={1} stopColor="#FF5F5F" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2611_2203"
          x1={0}
          y1="4.61538"
          x2="9.23077"
          y2="4.61538"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E70F0F" />
          <stop offset={1} stopColor="#FF5F5F" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2611_2203"
          x1="10.7695"
          y1="15.3847"
          x2="20.0003"
          y2="15.3847"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E70F0F" />
          <stop offset={1} stopColor="#FF5F5F" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_2611_2203"
          x1={0}
          y1="15.3847"
          x2="9.23077"
          y2="15.3847"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E70F0F" />
          <stop offset={1} stopColor="#FF5F5F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={21}
      height={20}
      viewBox="0 0 21 20"
      fill="none"
    >
      <path
        d="M13.5772 0.666667H16.6541C18.4065 0.666667 19.8336 2.09382 19.8336 3.84615V6.92308C19.8336 7.82737 19.0969 8.5641 18.1926 8.5641H13.5772C12.6729 8.5641 11.9362 7.82737 11.9362 6.92308V2.30769C11.9362 1.4034 12.6729 0.666667 13.5772 0.666667Z"
        stroke="#CCCCCC"
        strokeWidth="1.33333"
      />
      <path
        d="M4.34615 0.666667H7.42308C8.32737 0.666667 9.0641 1.4034 9.0641 2.30769V6.92308C9.0641 7.82737 8.32737 8.5641 7.42308 8.5641H2.80769C1.9034 8.5641 1.16667 7.82737 1.16667 6.92308V3.84615C1.16667 2.09382 2.59382 0.666667 4.34615 0.666667Z"
        stroke="#CCCCCC"
        strokeWidth="1.33333"
      />
      <path
        d="M13.5772 11.4362H18.1926C19.0969 11.4362 19.8336 12.1729 19.8336 13.0772V16.1541C19.8336 17.9065 18.4065 19.3336 16.6541 19.3336H13.5772C12.6729 19.3336 11.9362 18.5969 11.9362 17.6926V13.0772C11.9362 12.1729 12.6729 11.4362 13.5772 11.4362Z"
        stroke="#CCCCCC"
        strokeWidth="1.33333"
      />
      <path
        d="M2.80769 11.4362H7.42308C8.32737 11.4362 9.0641 12.1729 9.0641 13.0772V17.6926C9.0641 18.5969 8.32737 19.3336 7.42308 19.3336H4.34615C2.59382 19.3336 1.16667 17.9065 1.16667 16.1541V13.0772C1.16667 12.1729 1.9034 11.4362 2.80769 11.4362Z"
        stroke="#CCCCCC"
        strokeWidth="1.33333"
      />
    </svg>
  );
}

function WishlistIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
    >
      <g opacity="0.2">
        <path
          d="M17.5 6.4998C18.6045 6.4998 19.5 7.39523 19.5 8.4998M12.5 5.70234L13.1851 4.99981C15.316 2.81452 18.7709 2.81452 20.9018 4.9998C22.9755 7.1264 23.0392 10.5536 21.0461 12.7597L15.3197 19.098C13.7984 20.7818 11.2015 20.7818 9.68026 19.098L3.95393 12.7598C1.96078 10.5536 2.0245 7.12643 4.0982 4.99982C6.22912 2.81453 9.68404 2.81453 11.815 4.99982L12.5 5.70234Z"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
