import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth'; // Переконайтесь, що цей компонент адаптований під стиль

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-4 max-w-lg mx-auto shadow-2xl rounded-3xl bg-white'>
      <h1 className='text-3xl text-center font-semibold my-7'>Реєстрація</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder="Ім'я користувача"
          className='border p-3 rounded-full'
          id='username'
          onChange={handleChange}
        />
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
          {loading ? 'Завантаження...' : 'Зареєструватися'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Уже є акаунт?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700 hover:text-blue-800'>Увійти</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
