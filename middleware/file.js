const multer = require('multer')

const storage = multer.diskStorage({
  destination: 'images',
  filename(req, file, cb) {
    cb(null, new Date().toLocaleDateString() + '-' + file.originalname)
  }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
  
module.exports = multer({
    storage, fileFilter,
    limits: { fileSize: 1000 * 1000 }
})