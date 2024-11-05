import React, { useEffect, useState } from "react";
import bag1 from "../../assets/SlideBanners/bag1.jpg";
import bags1 from "../../assets/SlideBanners/bags1.jpg";
import kidswardrobe1 from "../../assets/SlideBanners/kidswardrobe1.jpg";
import menwardrobe1 from "../../assets/SlideBanners/menwardrobe1.jpg";
import menwardrobe2 from "../../assets/SlideBanners/menwardrobe2.jpg";
import wardrobe1 from "../../assets/SlideBanners/wardrobe1.jpg";
import { Button } from "@/components/ui/button";
import menIcon from "../../assets/icons/men.png";
import kidIcon from "../../assets/icons/kid.png";
import womenIcon from "../../assets/icons/women.png";
import handbagsIcon from "../../assets/icons/handbags.png";
import shoesIcon from "../../assets/icons/shoes.png";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { ShoppingProductTile } from "@/components";

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

const categories = [
  { id: "men", label: "Men", icon: menIcon },
  { id: "women", label: "Women", icon: womenIcon },
  { id: "kids", label: "Kids", icon: kidIcon },
  { id: "accessories", label: "Accessories", icon: handbagsIcon },
  { id: "footwear", label: "Footwear", icon: shoesIcon },
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
  const slides = [
    bag1,
    bags1,
    kidswardrobe1,
    menwardrobe1,
    menwardrobe2,
    wardrobe1,
  ];
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const [brandVisibleStartIndex, setBrandVisibleStartIndex] = useState(0);
  const [brandToShow, setBrandToShow] = useState(5);
  const visibleBrands = brands.slice(
    brandVisibleStartIndex,
    brandVisibleStartIndex + brandToShow
  );
  const handleNextBrand = () => {
    setBrandVisibleStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, brands.length - brandToShow)
    );
  };

  const handlePrevBrand = () => {
    setBrandVisibleStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, []);

  // Set up automatic slide rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Slider Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Category Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={item.icon}
                    alt={`${item.label} icon`}
                    className="w-12 h-12 mb-4"
                  />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-center mt-8 mb-8">
            Shop by brand
          </h2>
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {visibleBrands.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <img
                      src={item.icon}
                      alt={`${item.label} icon`}
                      className="w-12 h-12 mb-4"
                    />
                    <span className="font-bold">{item.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePrevBrand()}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 
             bg-white/50 transition-transform duration-300 ease-in-out"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNextBrand()}
              className="absolute top-1/2 right-2 transform -translate-y-1/2
             bg-white/50 transition-transform duration-300 ease-in-out"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
      <section className="py-12 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    product={productItem}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
