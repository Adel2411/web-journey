
import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';
import validatePost from '../middleware/validation.js';
import addTimestamp from '../middleware/timestamp.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', validatePost, addTimestamp, createPost);
router.put('/:id', validatePost, addTimestamp, updatePost);
router.delete('/:id', deletePost);

export default router;