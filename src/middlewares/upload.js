import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const extname = path.extname(file.originalname)
    cb(null, uniqueSuffix + extname)
  },
})

const upload = multer({ storage })

export default upload
