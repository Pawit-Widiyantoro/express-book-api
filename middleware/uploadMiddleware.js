const multer = require("multer");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({
    storage: diskStorage,
    limits: {fieldNameSize: 1024 * 1024 * 5},
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetypes = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetypes && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"));
        }
    }
});

module.exports=upload;