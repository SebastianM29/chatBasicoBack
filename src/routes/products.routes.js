import { Router } from "express";
import { add, allProducts, deletProduct, updateProduct } from "../controllers/products.controllers.js";
import multer from "multer";
import { storageProducts } from "../middlewares/multer.js";

const router = Router()
const uploadProducts = multer({storage:storageProducts})

router.post('/addProduct',uploadProducts.single('imagePath'),add)
router.delete('/deleteProduct/:id',deletProduct)
router.get('/allProducts',allProducts)
router.put('/updateProduct/:id',updateProduct)

export default router