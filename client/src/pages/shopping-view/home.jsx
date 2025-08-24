import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import { Airplay, BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from "lucide-react";

import brand1 from "../../assets/brandIcons/1.webp";
import brand2 from "../../assets/brandIcons/2.webp";
import brand3 from "../../assets/brandIcons/3.webp";
import brand4 from "../../assets/brandIcons/4.webp";
import brand5 from "../../assets/brandIcons/5.webp";
import brand6 from "../../assets/brandIcons/6.webp";
import brand7 from "../../assets/brandIcons/7.webp";
import brand8 from "../../assets/brandIcons/8.webp";
import brand9 from "../../assets/brandIcons/9.webp";
import brand10 from "../../assets/brandIcons/10.webp";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails, setProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

// Custom SVG icons as React components (accept className via props)
const MaleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={props.className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15 8c1.628 0 3.2 .787 4.707 2.293a1 1 0 0 1 -1.414 1.414c-.848 -.848 -1.662 -1.369 -2.444 -1.587l-.849 5.944v4.936a1 1 0 0 1 -2 0v-4h-2v4a1 1 0 0 1 -2 0v-4.929l-.85 -5.951c-.781 .218 -1.595 .739 -2.443 1.587a1 1 0 1 1 -1.414 -1.414c1.506 -1.506 3.08 -2.293 4.707 -2.293z" />
    <path d="M12 1a3 3 0 1 1 -3 3l.005 -.176a3 3 0 0 1 2.995 -2.824" />
  </svg>
);

const FemaleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={props.className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M14 8c1.91 0 3.79 .752 5.625 2.219a1 1 0 1 1 -1.25 1.562c-1.019 -.815 -2.016 -1.345 -2.997 -1.6l1.584 5.544a1 1 0 0 1 -.962 1.275h-1v4a1 1 0 0 1 -2 0v-4h-2v4a1 1 0 0 1 -2 0v-4h-1a1 1 0 0 1 -.962 -1.275l1.584 -5.545c-.98 .256 -1.978 .786 -2.997 1.601a1 1 0 1 1 -1.25 -1.562c1.733 -1.386 3.506 -2.133 5.307 -2.212l.335 -.007z" />
    <path d="M12 1a3 3 0 1 1 -3 3l.005 -.176a3 3 0 0 1 2.995 -2.824" />
  </svg>
);

const ShoeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 6h5.426a1 1 0 0 1 .863 .496l1.064 1.823a3 3 0 0 0 1.896 1.407l4.677 1.114a4 4 0 0 1 3.074 3.89v2.27a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1z" />
    <path d="M14 13l1 -2" />
    <path d="M8 18v-1a4 4 0 0 0 -4 -4h-1" />
    <path d="M10 12l1.5 -3" />
  </svg>
);

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: MaleIcon },
  { id: "women", label: "Women", icon: FemaleIcon },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: ShoeIcon },
];

const brands = [
  { id: "flexora", label: "Flexora", icon: brand1 },
  { id: "stridepeak", label: "StridePeak", icon: brand2 },
  { id: "velvio", label: "Velvio", icon: brand3 },
  { id: "nurotix", label: "Nurotix", icon: brand4 },
  { id: "revocore", label: "RevoCore", icon: brand5 },
  { id: "zypher", label: "Zypher", icon: brand6 },
  { id: "flauntis", label: "Flauntis", icon: brand7 },
  { id: "klyne", label: "Klyne", icon: brand8 },
  { id: "orbis", label: "Orbis", icon: brand9 },
  { id: "lumare", label: "Lumare", icon: brand10 },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [brandVisibleStartIndex, setBrandVisibleStartIndex] = useState(0);
  const [brandToShow, setBrandToShow] = useState(5);
  const visibleBrands = brands.slice(brandVisibleStartIndex, brandVisibleStartIndex + brandToShow);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    // Persist filters for listing page and navigate with query string
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    const params = new URLSearchParams();
    params.set(section, getCurrentItem.id);
    navigate(`/shop/listing?${params.toString()}`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    setOpenDetailsDialog(true);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    return () => {
      dispatch(setProductDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: { featured: true, limit: 12 },
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={slide?._id || index}
                onClick={() => navigate("/shop/listing")}
                className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 cursor-pointer`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 z-10"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 z-10"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card key={categoryItem.id} onClick={() => handleNavigateToListingPage(categoryItem, "category")} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by brand</h2>
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {visibleBrands.map((item) => (
                <Card key={item.id} onClick={() => handleNavigateToListingPage(item, "brand")} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <img src={item.icon} alt={`${item.label} icon`} className="w-12 h-12 mb-4" />
                    <span className="font-bold">{item.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={() => setBrandVisibleStartIndex((i) => Math.max(i - 1, 0))} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/50">
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setBrandVisibleStartIndex((i) => Math.min(i + 1, brands.length - brandToShow))} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/50">
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={(v) => {
          setOpenDetailsDialog(v);
          if (!v) dispatch(setProductDetails());
        }}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;


