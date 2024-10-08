import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";

function ProductImageUpload({
  className,
  imageFile,
  setImageFile,
  uploadedImageURL,
  setUploadedImageURL,
}) {
  const inputRef = useRef(null);
  const handleImageFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleOnDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    inputRef.current && (inputRef.current.value = "");
  };

  async function uploadImageToCloudinary() {
    const data = new FormData();
    data.append("myFile", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/products/uploadImage",
        data
      );

      if (response?.data?.success)
        setUploadedImageURL(response.data.result.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <label className="text-lg font-semibold mb-2 block">
        {imageFile ? `Check uploaded Image` : `Upload Image`}
      </label>
      <div
        className="border-2 border-dashed rounded-lg p-2"
        onDragOver={handleDragOver}
        onDrop={handleOnDrop}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col justify-center items-center h-32 cursor-pointer gap-2 mb-4"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-6 text-primary  h-7" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
