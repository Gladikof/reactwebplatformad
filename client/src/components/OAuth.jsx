import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa'; // Імпорт іконки Google

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Не вдалося увійти за допомогою Google', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='flex items-center justify-center bg-red-600 text-white p-3 rounded-full hover:bg-red-700'
    >
      <FaGoogle className="mr-2" /> Продовжити з Google
    </button>
  );
}
