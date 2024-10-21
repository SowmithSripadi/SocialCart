import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

function ViewProducts({ product }) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="h-[300px] w-full object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-4">{product?.title}</h2>
          <div className="flex lg:justify-start lg:gap-4 lg:items-center mb-2 md:flex-col">
            <span
              className={` ${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold text-red-500">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
          <CardFooter className="flex gap-5 justify-center items-center ">
            <Button>Edit</Button>
            <Button>Delete</Button>
          </CardFooter>
        </CardContent>
      </div>
    </Card>
  );
}

export default ViewProducts;
