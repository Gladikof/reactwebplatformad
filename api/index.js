import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import commentRouter from './routes/comment.route.js'; // Ensure this is imported only once
import path from 'path';
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Підключено до Mongoose!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log('Сервер працює на порту 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/comments', commentRouter); // Ensure this is used only once

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутрішня помилка сервера';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
