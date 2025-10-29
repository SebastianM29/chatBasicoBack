import { Router } from "express";
import { allUser, createUser, login, logout } from "../controllers/users.controllers.js";
import { authRegister } from "../middlewares/authRegister.js";

import multer from "multer";
import { storageUsers } from "../middlewares/multer.js";

const router = Router()
const uploadUser = multer({storage:storageUsers})


router.post('/createUser',uploadUser.single('imagePath'),authRegister('register'),createUser)
router.post('/login',authRegister('login'),login)
router.post('/logout',logout)


export default router