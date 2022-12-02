const multer = require("multer")
const fs = require("fs")
const util = require('util');
const maxSize = 100 * 1024 * 1024

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const PATH = __basedir + '/song/'
        if (!fs.existsSync(PATH)) {
            fs.mkdirSync(PATH)
        }
        cb(null, PATH)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});

let uploadFile = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        if (file.mimetype.includes("audio/")) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    },
    limits: { fileSize: maxSize }
}).single("lagu")

module.exports = util.promisify(uploadFile)