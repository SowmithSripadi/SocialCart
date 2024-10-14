const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dciclq2ss",
  api_key: "316971875368737",
  api_secret: "_jLQWN6alqjwRRcmDDu-pw7rkI8",
});

const storage = new multer.memoryStorage();

async function imageUploadUtility(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const uploads = multer({ storage });

module.exports = { uploads, imageUploadUtility };
