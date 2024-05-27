import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CommentForm = ({ listingId }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || text.trim() === '') {
      return alert('Будь ласка, залиште коментар і поставте оцінку');
    }

    try {
      const response = await axios.post('/api/comments', {
        text,
        rating,
        listingId,
        userId: currentUser._id,
        userName: currentUser.username, // Додаємо ім'я користувача
        userPhoto: currentUser.avatar, // Додаємо фото користувача
      });

      console.log('Response:', response.data);

      setText('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting comment:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Залишити коментар</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ваш коментар"
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-green-500"
        rows="4"
      ></textarea>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            onClick={() => setRating(i + 1)}
            className={`w-6 h-6 cursor-pointer ${i < rating ? 'text-yellow-500' : 'text-gray-400'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927C9.42 2.065 10.581 2.065 10.951 2.927L12.234 6.19L15.819 6.625C16.741 6.739 17.121 7.939 16.437 8.533L13.811 10.725L14.601 14.255C14.786 15.117 13.819 15.755 13.095 15.295L10 13.347L6.905 15.295C6.181 15.755 5.214 15.117 5.399 14.255L6.189 10.725L3.563 8.533C2.879 7.939 3.259 6.739 4.181 6.625L7.766 6.19L9.049 2.927Z" />
          </svg>
        ))}
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white rounded-full font-semibold text-lg py-3 px-6 hover:bg-green-700 transition-colors duration-300 ease-in-out"
      >
        Надіслати
      </button>
    </form>
  );
};

export default CommentForm;
