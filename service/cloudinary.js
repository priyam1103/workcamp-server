require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.REACT_APP_cloud_name,
  api_key: process.env.REACT_APP_api_key,
  api_secret: process.env.REACT_APP_api_secret,
});

module.exports = { cloudinary };