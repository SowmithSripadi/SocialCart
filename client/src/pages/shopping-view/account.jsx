import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getFeatureImages } from "@/store/common-slice";

function ShoppingAccount() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const coverImage =
    featureImageList && featureImageList.length > 0
      ? featureImageList[featureImageList.length - 1]?.image
      : null;

  return (
    <div className="flex flex-col">
      <div className="relative h-[180px] w-full overflow-hidden bg-muted">
        {coverImage ? (
          <img
            src={coverImage}
            alt="Account cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;


