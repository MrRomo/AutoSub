const multer = require("multer");

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/x-msvideo", "video/quicktime"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILETYPE";
        return cb(error, false)
    }
    console.log("correct video¡");
    
    cb(null, true);
}

module.exports = multer({
    dest: './uploads',
    fileFilter,
    limits: {
        fileSize: 100000000
    }
});