const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: 'dhanjicloudinary',
  api_key: '947557261572841',
  api_secret: 'gP7mj00X32MRbPxZjdI-_BL3wP8'
});

module.exports = cloudinary;