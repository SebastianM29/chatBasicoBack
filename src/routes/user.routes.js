import { Router } from "express";
import { allUser, createUser } from "../controllers/users.controllers.js";
import { authRegister } from "../middlewares/authRegister.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import multer from "multer";
import { storageUsers } from "../middlewares/multer.js";

const router = Router()
const uploadUser = multer({storage:storageUsers})

router.get('/allUser',isAuthenticated,allUser)
router.post('/createUser',uploadUser.single('imagePath'),authRegister('register'),createUser)
router.post('/login',authRegister('login'))

export default router