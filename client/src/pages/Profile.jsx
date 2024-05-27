import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-4 max-w-lg mx-auto shadow-2xl rounded-3xl bg-white'>
      <h1 className='text-3xl font-semibold text-center my-7'>Профіль</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='профіль'
          className='rounded-full h-48 w-48 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Помилка завантаження зображення (зображення повинно бути менше 2 МБ)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Завантаження ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Зображення успішно завантажено!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder="ім'я користувача"
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-full'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='електронна пошта'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-full'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='пароль'
          onChange={handleChange}
          id='password'
          className='border p-3 rounded-full'
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-full p-3 uppercase hover:bg-slate-800 disabled:bg-slate-500'
        >
          {loading ? 'Завантаження...' : 'Оновити'}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-full uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Створити оголошення
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='bg-red-700 text-white rounded-full p-2 cursor-pointer hover:bg-red-800'
        >
          Видалити акаунт
        </span>
        <span onClick={handleSignOut} className='bg-red-900 text-white rounded-full p-2 cursor-pointer hover:bg-red-800'>
          Вийти
        </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'Користувач успішно оновлений!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full mt-5'>
        Показати оголошення
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Помилка показу оголошень' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4 mt-5'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Ваші оголошення
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4 shadow hover:shadow-lg transition-shadow duration-300'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='обкладинка оголошення'
                  className='h-16 w-16 object-cover rounded-lg'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col items-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase mb-1 px-3 py-1 text-sm border border-red-700 rounded-full hover:bg-red-700 hover:text-white transition-colors duration-300'
                >
                  Видалити
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase px-3 py-1 text-sm border border-green-700 rounded-full hover:bg-green-700 hover:text-white transition-colors duration-300'>
                    Редагувати
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
