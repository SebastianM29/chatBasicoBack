import { Router } from "express";
import { allUser, createUser } from "../controllers/users.controllers.js";
import { authRegister } from "../middlewares/authRegister.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = Router()


router.get('/allUser',isAuthenticated,allUser)
router.post('/createUser',authRegister('register'),createUser)
router.post('/login',authRegister('login'))

export default router