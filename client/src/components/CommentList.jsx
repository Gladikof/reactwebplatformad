import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentList = ({ listingId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments/${listingId}`);
        setComments(res.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [listingId]);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Коментарі</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="bg-white p-4 mb-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <img src={comment.userPhoto} alt={comment.userName} className="w-10 h-10 rounded-full mr-4" />
              <div>
                <p className="text-lg font-semibold text-gray-900">{comment.userName}</p>
                <div className="flex items-center">
                  {[...Array(comment.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927C9.42 2.065 10.581 2.065 10.951 2.927L12.234 6.19L15.819 6.625C16.741 6.739 17.121 7.939 16.437 8.533L13.811 10.725L14.601 14.255C14.786 15.117 13.819 15.755 13.095 15.295L10 13.347L6.905 15.295C6.181 15.755 5.214 15.117 5.399 14.255L6.189 10.725L3.563 8.533C2.879 7.939 3.259 6.739 4.181 6.625L7.766 6.19L9.049 2.927Z"/></svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-800">{comment.text}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Ще немає коментарів</p>
      )}
    </div>
  );
};

export default CommentList;
