import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { addProductFormElements } from "../../config/index";
import Commonform from "@/components/common/form";
import ProductImageUpload from "../../components/admin/imageUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { useToast } from "@/hooks/use-toast";
import ViewProducts from "@/components/admin/viewProducts";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProducts, setopenCreateProducts] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [imageLoadingState, setimageLoadingState] = useState(false);
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [currentEditTile, setCurrentEditTile] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();

    currentEditTile !== null
      ? dispatch(editProduct({ id: currentEditTile, formData })).then(
          (data) => {
            if (data?.payload?.success) {
              dispatch(fetchAllProducts());
              setFormData(initialFormData);
              setCurrentEditTile(null);
              setopenCreateProducts(false);
            }
          }
        )
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageURL,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts()); // we need the latest added product on the ui, therefore dispatching
            setopenCreateProducts(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product added successfully",
            });
          }
        });
  };

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => {
        formData[key] !== "";
      })
      .every((item) => item);
  }

  const handleDeleteProductTile = (tobedeletedID) => {
    dispatch(deleteProduct({ id: tobedeletedID })).then((data) => {
      console.log(data);
      dispatch(fetchAllProducts());
    });
  };
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  //this useEffect runs when the component first mounts

  return (
    <>
      <div className="flex justify-end w-full mb-4">
        <Button onClick={() => setopenCreateProducts(true)}>
          Add New Products
        </Button>
      </div>
      <div className="grid grid-4 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
        {productList && productList.length > 0
          ? productList.map((product) => (
              <ViewProducts
                product={product}
                setCurrentEditTile={setCurrentEditTile}
                setFormData={setFormData}
                setopenCreateProducts={setopenCreateProducts}
                key={product._id}
                handleDeleteProductTile={handleDeleteProductTile}
              />
            ))
          : null}
      </div>

      <Sheet
        open={openCreateProducts}
        onOpenChange={() => {
          setopenCreateProducts(false);
          setCurrentEditTile(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent
          aria-describedby={null}
          side="right"
          style={{
            maxHeight: "100vh", // Limit height to the viewport height
            overflowY: "auto", // Enable vertical scrolling
          }}
        >
          <SheetHeader>
            <SheetTitle className="text-xl mt-3 text-center">
              {currentEditTile !== null ? "Edit New Product" : "Add Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            className="m-2"
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageURL={uploadedImageURL}
            setUploadedImageURL={setUploadedImageURL}
            setimageLoadingState={setimageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditTile !== null}
          />
          {imageLoadingState ? (
            <>
              <p className="text-base text-center text-gray-500 ">
                Image is being uploaded
              </p>
            </>
          ) : (
            <Commonform
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText={currentEditTile !== null ? "Edit" : "Add"}
              className="m-2"
              isBtnDisabled={!isFormValid()}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AdminProducts;
