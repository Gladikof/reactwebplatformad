import express from 'express';
import {
  createComment,
  getComments,
  deleteComment
} from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.route('/:listingId').get(getComments);
router.route('/').post(verifyToken, createComment);
router.route('/:id').delete(verifyToken, deleteComment);

export default router;
