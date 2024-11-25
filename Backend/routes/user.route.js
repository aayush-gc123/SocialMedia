import express from "express";
import { register , loginUser , logoutUser , getProfile , editProfile , getOtherUsers, followOrUnfollowUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();


router.route('/register').post(register)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/:id/profile').get(isAuthenticated , getProfile)
router.route('/profile/edit').post(isAuthenticated ,upload.single('profilePhoto') , editProfile)
router.route('/suggested').get(isAuthenticated , getOtherUsers),
router.route('/followorunfollow/:id').post(isAuthenticated , followOrUnfollowUser)

export default router