const multer = require('multer');
const path = require('path')

const config = multer({
  dest: path.join(__dirname, '../public/upload/temp'),
  limits: { fileSize: 100000000 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/x-msvideo", "video/quicktime"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILETYPE";
        return cb(error, false)
    }else{
        return (cb(null, true))
    }
  }
})

module.exports = config 