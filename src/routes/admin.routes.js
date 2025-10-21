import { Router } from "express";
import { add, allProducts, deletProduct, updateProduct } from "../controllers/products.controllers.js";
import multer from "multer";
import { storageProducts } from "../middlewares/multer.js";
import { allUser, editProfileUser, monthSales } from "../controllers/users.controllers.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = Router()
const uploadProducts = multer({storage:storageProducts})
router.get('/allUser',isAuthenticated,allUser)
router.put('editProfileUser/:id',isAuthenticated,editProfileUser)



router.get('/allProducts',allProducts)
router.post('/addProduct',isAuthenticated,uploadProducts.single('imagePath'),add)
router.put('/updateProduct/:id',isAuthenticated,updateProduct)
router.delete('/deleteProduct/:id',isAuthenticated,deletProduct)



router.get('/monthlySalesUser/:id/:year',isAuthenticated,monthSales)



export default router