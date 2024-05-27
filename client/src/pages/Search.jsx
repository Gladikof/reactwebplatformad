import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
    bedrooms: '',
    bathrooms: '',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    const bedroomsFromUrl = urlParams.get('bedrooms');
    const bathroomsFromUrl = urlParams.get('bathrooms');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      bedroomsFromUrl ||
      bathroomsFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
        bedrooms: bedroomsFromUrl || '',
        bathrooms: bathroomsFromUrl || '',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }

    if (e.target.id === 'bedrooms') {
      setSidebardata({ ...sidebardata, bedrooms: e.target.value });
    }

    if (e.target.id === 'bathrooms') {
      setSidebardata({ ...sidebardata, bathrooms: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    if (sidebardata.bedrooms) {
      urlParams.set('bedrooms', sidebardata.bedrooms);
    }
    if (sidebardata.bathrooms) {
      urlParams.set('bathrooms', sidebardata.bathrooms);
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen bg-gray-50 w-full md:w-1/4'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Пошук:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Пошук...'
              className='border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Тип:</label>
            <div className='flex flex-wrap gap-2'>
              <div className='flex items-center'>
                <input
                  type='radio'
                  id='all'
                  className='w-5 h-5 accent-green-600'
                  onChange={handleChange}
                  checked={sidebardata.type === 'all'}
                />
                <label htmlFor='all' className='ml-2 text-sm'>
                  Оренда та Продаж
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='radio'
                  id='rent'
                  className='w-5 h-5 accent-green-600'
                  onChange={handleChange}
                  checked={sidebardata.type === 'rent'}
                />
                <label htmlFor='rent' className='ml-2 text-sm'>
                  Оренда
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='radio'
                  id='sale'
                  className='w-5 h-5 accent-green-600'
                  onChange={handleChange}
                  checked={sidebardata.type === 'sale'}
                />
                <label htmlFor='sale' className='ml-2 text-sm'>
                  Продаж
                </label>
              </div>
            </div>
            <div className='flex items-center mt-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5 h-5 accent-green-600'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <label htmlFor='offer' className='ml-2 text-sm'>
                Знижка
              </label>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Зручності:</label>
            <div className='flex flex-wrap gap-2'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-5 h-5 accent-green-600'
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <label htmlFor='parking' className='ml-2 text-sm'>
                  Парковка
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-5 h-5 accent-green-600'
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <label htmlFor='furnished' className='ml-2 text-sm'>
                  Мебльована
                </label>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Кількість спалень:</label>
            <select
              id='bedrooms'
              value={sidebardata.bedrooms}
              onChange={handleChange}
              className='border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500'
            >
              <option value=''>Будь-яка</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Кількість ванних кімнат:</label>
            <select
              id='bathrooms'
              value={sidebardata.bathrooms}
              onChange={handleChange}
              className='border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500'
            >
              <option value=''>Будь-яка</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Сортувати:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              <option value='regularPrice_desc'>Від високої до низької</option>
              <option value='regularPrice_asc'>Від низької до високої</option>
              <option value='createdAt_desc'>Останні</option>
              <option value='createdAt_asc'>Найстаріші</option>
            </select>
          </div>
          <button className='bg-green-600 text-white p-3 rounded-lg uppercase hover:bg-green-500'>
            Пошук
          </button>
        </form>
      </div>
      <div className='flex-1 p-7'>
        <h1 className='text-3xl font-semibold border-b p-3 text-gray-700 mt-5'>
          Результати оголошень:
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-gray-700'>Оголошень не знайдено!</p>
          )}
          {loading && (
            <p className='text-xl text-gray-700 text-center w-full'>
              Завантаження...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-600 hover:underline p-7 text-center w-full'
            >
              Показати більше
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
