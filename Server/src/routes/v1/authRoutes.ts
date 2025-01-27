import express from "express"
import * as authControllers from "../../controllers/auth"
import asyncHandler from "../../utils/asyncHandler"

const router=express.Router()

router.post("/login",asyncHandler(authControllers.login))
router.post("/logout",asyncHandler(authControllers.logout))

router.post("/register-user",asyncHandler(authControllers.registerUser))

router.post("/refresh-token",asyncHandler(authControllers.refreshToken))



export default router