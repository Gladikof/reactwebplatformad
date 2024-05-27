import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth'; // Переконайтесь, що цей компонент підтримує потрібні props

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='p-4 max-w-lg mx-auto shadow-2xl rounded-3xl bg-white'>
      <h1 className='text-3xl text-center font-semibold my-7'>Вхід</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Електронна пошта'
          className='border p-3 rounded-full'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Пароль'
          className='border p-3 rounded-full'
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-full uppercase hover:bg-slate-800 disabled:bg-slate-500'
        >
          {loading ? 'Завантаження...' : 'Вхід'}
        </button>
        <OAuth customStyles="bg-red-600 text-white p-3 rounded-full hover:bg-red-700" /> {/* Змінені стилі передані через props */}
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Немає акаунту?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700 hover:text-blue-800'>Зареєструватися</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
