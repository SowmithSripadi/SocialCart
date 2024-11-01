import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";

import { deleteCartItems } from "@/store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((slice) => slice.auth);
  const dispatch = useDispatch();

  const handleDeleteCartItems = (cartItem) => {
    dispatch(
      deleteCartItems({ userId: user?.id, productId: cartItem?.productId })
    );
  };

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-[70px] h-[70px] rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold"> {cartItem?.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex gap-2">
          {cartItem?.salePrice > 0 ? (
            <p className="line-through text-muted-foreground">
              ${cartItem?.price}
            </p>
          ) : null}

          <p className="font-semibold">
            $
            {(cartItem?.salePrice > 0
              ? cartItem?.salePrice
              : cartItem?.price * cartItem?.quantity
            ).toFixed(2)}
          </p>
        </div>
        <Trash
          className="cursor-pointer mt-1"
          size={20}
          onClick={() => handleDeleteCartItems(cartItem)}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
