import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-tems-content";

function UserCartWrapper({ cartItems }) {
  let total =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((sum, currVal) => {
          return (
            sum +
            (currVal?.salePrice > 0 ? currVal?.salePrice : currVal?.price) *
              currVal?.quantity
          );
        }, 0)
      : // ? cartItems.map((item) => {
        //     total +=
        //       item.quantity *
        //       (item?.salePrice > 0 ? item?.salePrice : item?.price);
        //   })
        null;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item, index) => (
              <UserCartItemsContent key={index} cartItem={item} />
            ))
          : null}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${total}</span>
        </div>
      </div>
      <Button className="w-full mt-6">Checkout</Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
