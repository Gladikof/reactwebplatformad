import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaShower, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import Contact from '../components/Contact';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const buttonGradientColors = [
    'from-purple-500 via-pink-500 to-red-500',
    'from-red-500 via-yellow-500 to-green-500',
    'from-green-500 via-teal-500 to-blue-500',
    'from-blue-500 via-indigo-500 to-purple-500',
    'from-pink-500 via-red-500 to-yellow-500',
    'from-yellow-500 via-green-500 to-blue-500'
  ];

  const formatYouTubeUrl = (url) => {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    return ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId;
  };

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Завантаження...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Щось пішло не так!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={url}>
                <div
                  className='relative h-[550px] w-full flex justify-center items-center rounded-xl shadow-lg overflow-hidden'
                >
                  <img
                    src={url}
                    alt="Listing"
                    className='h-full w-full object-contain'
                  />
                  <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg shadow-lg text-white font-bold text-center bg-gradient-to-r ${buttonGradientColors[index % buttonGradientColors.length]}`}>
                    {listing.type === 'rent' ? 'Оренда' : 'Продаж'}
                  </div>
                  {listing.offer && (
                    <div className={`absolute top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white font-bold text-center bg-gradient-to-r ${buttonGradientColors[(index + 1) % buttonGradientColors.length]}`}>
                      ${+listing.regularPrice - +listing.discountPrice} ЗНИЖКА
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-gradient-to-b from-green-500 to-green-700 hover:from-green-700 hover:to-green-900 cursor-pointer shadow-lg transition-all duration-300'>
            <FaShare
              className='text-white animate-pulse'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>

          {copied && (
            <p className='fixed top-24 right-6 z-20 rounded-md bg-white p-3 shadow-md text-sm font-medium text-green-600 transition-opacity duration-300 ease-in-out opacity-100'>
              Посилання скопійоване!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-5 my-8 gap-5 bg-white rounded-2xl shadow-lg'>
            <div className='flex flex-col gap-2 border-b pb-4'>
              <p className='text-3xl font-semibold text-slate-900'>
                {listing.name} - ${' '}
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / місяць'}
              </p>
              <p className='flex items-center gap-2 text-slate-600 text-lg'>
                <FaMapMarkerAlt className='text-green-700' />
                {listing.address}
              </p>
            </div>
            <div className='bg-slate-50 p-6 rounded-lg shadow-inner'>
              <h2 className='text-2xl font-bold text-green-700 mb-2'>Опис</h2>
              <p className='text-slate-800 leading-relaxed'>
                {listing.description}
              </p>
            </div>
            {listing.videoUrl && (
              <div className='bg-slate-50 p-6 rounded-lg shadow-inner'>
                <h2 className='text-2xl font-bold text-green-700 mb-2'>Відео</h2>
                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden" style={{paddingBottom: '56.25%'}}>
                  <iframe
                    src={`https://www.youtube.com/embed/${formatYouTubeUrl(listing.videoUrl)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}
            <ul className='text-green-900 font-semibold text-lg flex flex-wrap items-center gap-4 sm:gap-6 border-t pt-4'>
              <li className='flex items-center gap-1'>
                <FaBed className='text-2xl' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Кімнати `
                  : `${listing.bedrooms} Кімната `}
              </li>
              <li className='flex items-center gap-1'>
                <FaShower className='text-2xl' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Ванні кімнати `
                  : `${listing.bathrooms} Ванна кімната `}
              </li>
              <li className='flex items-center gap-2 text-lg font-medium'>
                <FaParking className={listing.parking ? 'text-green-600 text-2xl' : 'text-red-600 text-2xl'} />
                <span className={listing.parking ? 'text-green-600' : 'text-red-600'}>
                  {listing.parking ? 'Парковка доступна' : 'Парковки немає'}
                </span>
              </li>
              <li className='flex items-center gap-2 text-lg font-medium'>
                <FaChair className={listing.furnished ? 'text-green-600 text-2xl' : 'text-red-600 text-2xl'} />
                <span className={listing.furnished ? 'text-green-600' : 'text-red-600'}>
                  {listing.furnished ? 'Мебльована' : 'Без меблів'}
                </span>
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={() => setContact(true)} className='bg-green-600 text-white rounded-full font-semibold text-lg py-3 px-6 hover:bg-green-700 transition-colors duration-300 ease-in-out mt-4'>
                Зв'язатися з власником
              </button>
            )}
            {contact && <Contact listing={listing} />}
            <CommentList listingId={listing._id} />
            {currentUser && (
              <CommentForm listingId={listing._id} userId={currentUser._id} />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
