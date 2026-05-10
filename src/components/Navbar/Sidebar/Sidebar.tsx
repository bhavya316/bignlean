import Favourite from "../Favourite/Favourite";
import Notification from "../Notification/Notification";
import Profile from "../Profile/Profile";
import ShoppingBag from "../ShoppingBag/ShoppingBag";

export default function Sidebar() {
  return (
    <div className="flex-1 change-sidebar">
      <div className="max-[750px]:hidden">
        <Favourite />
      </div>
      <Notification />
      <ShoppingBag />
      <div className="max-[750px]:hidden">
        <Profile />
      </div>
    </div>
  );
}
