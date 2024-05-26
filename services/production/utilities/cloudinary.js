const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dskffiksr",
  api_key: "424982255271138",
  api_secret: "P4Z5k3-0QouAnyVou8EA74g33Es",
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
