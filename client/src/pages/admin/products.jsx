import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useState } from "react";
import { addProductFormElements } from "../../config/index";
import Commonform from "@/components/common/form";
import ProductImageUpload from "../../components/admin/imageUpload";

function AdminProducts() {
  const [openCreateProducts, setopenCreateProducts] = useState(false);
  const [formData, setFormData] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState("");

  const onSubmit = () => {};
  return (
    <>
      <div className="flex justify-end w-full">
        <Button onClick={() => setopenCreateProducts(true)}>
          Add New Products
        </Button>
      </div>
      <div className="grid grid-4 md:grid-cols-3 lg:grid-cols-4"></div>
      <Sheet open={openCreateProducts} onOpenChange={setopenCreateProducts}>
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
              Add New Product
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            className="m-2"
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageURL={uploadedImageURL}
            setUploadedImageURL={setUploadedImageURL}
          />
          <Commonform
            formControls={addProductFormElements}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            buttonText={"Add"}
            className="m-2"
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AdminProducts;
