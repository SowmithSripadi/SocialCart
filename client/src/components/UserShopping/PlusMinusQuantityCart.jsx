import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateCartItems } from "@/store/shop/cart-slice";
import { useSelector } from "react-redux";

function PlusMinusQuantityCart({ cartItem, handleDeleteCartItems }) {
  const { user } = useSelector((slice) => slice.auth);
  const { sessionId } = useSelector((slice) => slice.collabSlice);
  const dispatch = useDispatch();
  const handleUpdateQuantity = (cartItem, value) => {
    if (value === "minus" && cartItem.quantity <= 1) {
      handleDeleteCartItems(cartItem);
    } else {
      dispatch(
        updateCartItems({
          userId: user?.id,
          sessionId: sessionId || undefined, // If session.id is undefined, this will just be omitted
          productId: cartItem?.productId,
          quantity:
            value === "plus" ? cartItem?.quantity + 1 : cartItem?.quantity - 1,
        })
      );
    }
  };

  return (
    <div className="flex items-center mt-1 gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => {
          handleUpdateQuantity(cartItem, "minus");
        }}
        // disabled={cartItem?.quantity === 1}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease</span>
      </Button>
      <span className="font-semibold"> {cartItem?.quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => {
          handleUpdateQuantity(cartItem, "plus");
        }}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Decrease</span>
      </Button>
    </div>
  );
}

export default PlusMinusQuantityCart;
