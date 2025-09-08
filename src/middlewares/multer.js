import multer from "multer"
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)


export const storageProducts = multer.diskStorage({
    destination: function (req,res,cb) {
        cb(null,path.join(_dirname,'../public/img'))
    },
    filename: function (req,file,cb) {
        cb(null,new Date().getTime() + path.extname(file.originalname))
    }
})