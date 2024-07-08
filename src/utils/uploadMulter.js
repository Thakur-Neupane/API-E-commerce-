import multer from "multer";

const imgFolderPath = "public/img/product";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let error = null;
    cb(error, imgFolderPath);
  },
  filename: function (req, file, cb) {
    let error = "";

    // make a unique filename

    const fullFileName = Date.now() + "-" + file.originalname;

    cb(error, fullFileName);
  },
});

const multerUpload = multer({ storage });

export default multerUpload;
