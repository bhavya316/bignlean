import { ShoppingBagIcon } from "@/Icons";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetCartList } from "@/queries/Cart";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShoppingBag() {
  const { userData } = useAppContext();
  const [hasItems, setHasItems] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);
  
  const { data: cartList, dataUpdatedAt } = useGetCartList(
    userData?.id as number
  );
  
  useEffect(() => {
    if (cartList?.data?.cartItems) {
      // Calculate total quantity across all items
      const quantity = cartList.data.cartItems.reduce((total: number, item: any) => {
        // Ensure qty is treated as a number
        return total + (Number(item.qty) || 0);
      }, 0);
      
      setTotalQuantity(quantity);
      setHasItems(quantity > 0);
    } else {
      setTotalQuantity(0);
      setHasItems(false);
    }
  }, [cartList, dataUpdatedAt]);

  return (
    <Link href={"/cart"}>
      <div className={`relative`}>
        {totalQuantity > 0 ? (
          <div className="absolute text-[10px] top-[-5px] right-[-5px] p-2 bg-red-600 h-2 text-white flex items-center justify-center w-2 rounded-full">
            {totalQuantity}
          </div>
        ) : (
          ""
        )}
        <ShoppingBagIcon />
      </div>
    </Link>
  );
}
