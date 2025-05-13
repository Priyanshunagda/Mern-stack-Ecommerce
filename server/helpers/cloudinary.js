const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { memoryStorage } = require("multer");

cloudinary.config({
cloud_name: 'dc6ay1tgt',
  api_key: '515656846956687',
  api_secret: 'Q_pGwCZSeuffuPTVrqTE6qcXaV0',
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
