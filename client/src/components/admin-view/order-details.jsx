import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = { status: "" };

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function formatDate(value) {
    if (!value) return "N/A";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "N/A";
    return d.toISOString().split("T")[0];
  }

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({ title: data?.payload?.message });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{formatDate(orderDetails?.createdAt || orderDetails?.orderDate)}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.total ?? orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod || "N/A"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus || "N/A"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge className="py-1 px-3">{orderDetails?.status || orderDetails?.orderStatus}</Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {(orderDetails?.items || orderDetails?.cartItems || []).map((item) => (
                <li key={item.productId} className="flex items-center justify-between">
                  <span>Title: {item.title}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ${item.salePrice ?? item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.name || user?.userName}</span>
              <span>{orderDetails?.address?.address || orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.address?.city || orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.address?.pincode || orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.address?.phone || orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.address?.notes || orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;


