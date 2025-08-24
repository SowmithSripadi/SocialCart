import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCartItems, deleteCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({ product, handleGetProductDetails }) {
  if (!product) return null;

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { sessionId } = useSelector((state) => state.collabSlice);
  const cartItems = useSelector((state) => state.shopCart.cartItems?.items || []);

  const cartIndex = cartItems.findIndex((item) => item.productId === product._id);
  const inCart = cartIndex > -1;
  const quantity = inCart ? cartItems[cartIndex].quantity : 0;

  function handleAdd() {
    dispatch(
      addToCart({
        userId: user?.id,
        sessionId: sessionId || null,
        productId: product._id,
        quantity: 1,
      })
    );
  }

  function handleUpdate(type) {
    if (!inCart) return;
    if (type === "plus") {
      const nextQty = quantity + 1;
      if (product.totalStock && nextQty > product.totalStock) {
        toast({ title: `Only ${quantity} quantity can be added for this item`, variant: "destructive" });
        return;
      }
      dispatch(
        updateCartItems({
          userId: user?.id,
          sessionId: sessionId || null,
          productId: product._id,
          quantity: nextQty,
        })
      );
    } else {
      if (quantity === 1) {
        dispatch(
          deleteCartItems({
            userId: user?.id,
            sessionId: sessionId || null,
            productId: product._id,
          })
        );
      } else {
        dispatch(
          updateCartItems({
            userId: user?.id,
            sessionId: sessionId || null,
            productId: product._id,
            quantity: quantity - 1,
          })
        );
      }
    }
  }

  function handleTileClick() {
    if (handleGetProductDetails) handleGetProductDetails(product._id);
  }

  return (
    <Card className="overflow-hidden cursor-pointer" onClick={handleTileClick}>
      <div className="w-full h-60 overflow-hidden bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover object-center"
          />
        ) : null}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1 min-h-[64px]">
          <div className="font-bold line-clamp-1">{product.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {product.description}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="font-semibold">${product.salePrice > 0 ? product.salePrice : product.price}</div>
          <div className="flex gap-2 items-center">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleGetProductDetails?.(product._id);
              }}
            >
              Details
            </Button>
            {!inCart ? (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd();
                }}
              >
                Add to cart
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate("minus");
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold w-6 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate("plus");
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShoppingProductTile;


