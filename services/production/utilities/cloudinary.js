const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "######",
  api_key: "#########",
  api_secret: "###########",
});
async function uploadImage(base64Data, folderName) {
  try {
    const result = await cloudinary.uploader.upload(base64Data);
    return result.url;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadImage };
