import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-cow-pattern shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex items-center'>
            <img
              src='https://media.discordapp.net/attachments/534883976205303831/1239366503732609184/image-removebg-preview_1.png?ex=66551e80&is=6653cd00&hm=05f3ca9193c8c6a3e74d3ae70817b49ae833e80c55e5cd0e8298907a9dbc3c6e&=&format=webp&quality=lossless&width=705&height=299'
              className='h-15 w-32 mr-5'
              alt='Логотип'
            />
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-2 rounded-full flex items-center sm:w-96 lg:w-1/2'
        >
          <input
            type='text'
            placeholder='Пошук...'
            className='bg-transparent focus:outline-none flex-1 rounded-full p-1'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
        <ul className='flex gap-4 items-center'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 bg-white hover:bg-slate-700 hover:text-white text-lg px-3 py-2 rounded-full'>
              Головна
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 bg-white hover:bg-slate-700 hover:text-white text-lg px-3 py-2 rounded-full whitespace-nowrap'>
              Про нас
            </li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-10 w-10 object-cover border-2 border-white bg-white'
                src={currentUser.avatar}
                alt='профіль'
              />
            ) : (
              <li className='text-slate-700 bg-white hover:bg-slate-700 hover:text-white px-3 py-2 rounded-full'>
                Увійти
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
