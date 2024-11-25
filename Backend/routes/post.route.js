import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getMessage, sendMsg } from "../controllers/message.controller.js";
import upload from "../middlewares/multer.js";
import { addNewPost, BookMarkPost, delatePost, DislikePosts, getAllPosts, getCommentPost, getUserPost, LikePosts } from "../controllers/post.controller.js";

const router = express.Router();


router.route('/addpost').post(isAuthenticated , upload.single('image'),addNewPost);
router.route('/all/').get(isAuthenticated , getAllPosts);
router.route('/userpost/all').get(isAuthenticated , getUserPost);
router.route('/:id/like').get(isAuthenticated , LikePosts);
router.route('/:id/dislike').get(isAuthenticated , DislikePosts);
router.route('/:id/comment').post(isAuthenticated , getCommentPost);
router.route('/delete/:id').post(isAuthenticated , delatePost);
router.route('/:id/bookmark').post(isAuthenticated , BookMarkPost);


export default router