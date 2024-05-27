import Comment from '../models/comment.model.js';
import { errorHandler } from '../utils/error.js';

// Створення коментаря
export const createComment = async (req, res, next) => {
  const { text, rating, listingId, userName, userPhoto } = req.body;
  const userId = req.user.id;

  console.log('Request Body:', req.body);
  console.log('User Info:', { userId, userName, userPhoto });

  try {
    const comment = await Comment.create({ text, rating, listingId, userId, userName, userPhoto });
    return res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    next(error);
  }
};

// Отримання коментарів
export const getComments = async (req, res, next) => {
  const { listingId } = req.params;
  try {
    const comments = await Comment.find({ listingId }).populate('userId', 'username avatar');
    return res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    next(error);
  }
};

// Видалення коментаря
export const deleteComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);

    if (!comment) {
      return next(errorHandler(404, 'Коментар не знайдено'));
    }

    await comment.remove();
    return res.status(200).json({ success: true, message: 'Коментар видалено' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    next(error);
  }
};
