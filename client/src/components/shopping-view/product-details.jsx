import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  if (!productDetails) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{productDetails?.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full h-56 overflow-hidden bg-muted">
            {productDetails?.image ? (
              <img src={productDetails.image} alt={productDetails.title} className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">{productDetails?.description}</div>
            <div className="font-semibold">Price: ${productDetails?.salePrice > 0 ? productDetails?.salePrice : productDetails?.price}</div>
            <div className="text-sm">Brand: {productDetails?.brand}</div>
            <div className="text-sm">Category: {productDetails?.category}</div>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;


