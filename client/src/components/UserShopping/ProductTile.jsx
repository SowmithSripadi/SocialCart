import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import PlusMinusQuantityCart from "./PlusMinusQuantityCart";
import { useSelector, useDispatch } from "react-redux";
import { deleteCartItems } from "@/store/shop/cart-slice";

function ShoppingProductTile({ product, handleProductClick, handleAddtoCart }) {
  const { cartItems } = useSelector((state) => state.shopCart);

  const filteredItem = (cartItems?.items || []).filter(
    (item) => item?.productId === product?._id
  );
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleDeleteCartItems = (cartItem) => {
    dispatch(
      deleteCartItems({ userId: user?.id, productId: cartItem?.productId })
    );
  };

  // console.log(cartItems?.items);
  // console.log(product);
  // console.log(filteredItem);
  // console.log(cartItems);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div
        onClick={() => {
          handleProductClick(product?._id);
        }}
        className="cursor-pointer"
      >
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-sm text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={` ${
                product?.salePrice > 0
                  ? "line-through text-muted-foreground"
                  : "text-primary"
              } text-lg font-semibold `}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span
                className={` ${
                  product?.salePrice > 0 ? "text-red-600" : null
                } text-xl font-semibold text-primary`}
              >
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {filteredItem?.[0]?.quantity > 0 ? (
          <PlusMinusQuantityCart
            cartItem={filteredItem[0]}
            handleDeleteCartItems={handleDeleteCartItems}
          />
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
