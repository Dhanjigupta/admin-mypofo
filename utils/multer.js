const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  filename: (req, file, cb) => {
             cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
               // file.fieldname is name of the field (image)
               // path.extname get the uploaded file extension
   },
});