import express from "express";
import { getPostsBySearch,getPosts, createPost, updatePost, deletePost, likePost } from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// localhost:5000/posts
router.get('/', getPosts);

router.get('/search',getPostsBySearch)
// localhost:5000/posts
router.post('/', auth, createPost);
// localhost:5000/posts/id
router.patch('/:id',auth, updatePost);
router.delete('/:id',auth, deletePost)
router.patch('/:id/likepost',auth, likePost)

export default router