"use client";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import NotificationCard from "./NotificationCard";
import { NotificationIcon } from "@/Icons";
import { useGetNotificationList } from "@/queries/Cart";

type NotificationItem = {
  id: number;
  image: string;
  title: string;
  link: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export default function Notification() {
  const { notificationToggle } = useAppContext();
  const dispatch = useDispatchContext();
  const { data } = useGetNotificationList();

  return (
    <div className="relative">
      <button
        className="flex"
        onClick={() =>
          dispatch({
            type: !notificationToggle
              ? "NOTIFICATION_TOGGLE_ON"
              : "NOTIFICATION_TOGGLE_OFF",
          })
        }
      >
        <NotificationIcon />
      </button>
      {notificationToggle && (
        <div
          onMouseLeave={() => dispatch({ type: "NOTIFICATION_TOGGLE_OFF" })}
          className="absolute w-[450px] max-md:w-[300px] top-full right-0 bg-white sm-1 rounded-xl z-[2000] p-6 flex flex-col gap-3 max-h-[400px] overflow-auto "
        >
          {data?.data?.notifications.map(
            (item: NotificationItem, index: number) => (
              <NotificationCard
                key={index}
                label={item.title}
                src={item.image}
                subLabel={item.body}
                time={item.createdAt}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
