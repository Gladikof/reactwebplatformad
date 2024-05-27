import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=6');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=6');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=6');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-10 p-10 md:p-20 max-w-screen-xl mx-auto'>
        <h1 className='text-green-500 font-bold text-4xl lg:text-7xl text-center'>
          Знайдіть <span className='text-slate-900'>пейзаж</span> своєї <span className='text-slate-900'>мрії</span>
        </h1>
        <div className='text-gray-400 text-lg sm:text-xl text-center mt-2'>
          <span className="font-bold">Chill Spot</span> - це онлайн платформа для оголошень, яка задовольняє потреби осіб, що шукають оренду або продаж нерухомості з прекрасними пейзажами
          <br />
          
        </div>
        <Link to={'/search'} className='text-lg sm:text-xl text-green-700 font-bold hover:underline block text-center mt-2'>
          Знайдемо вашу мрію!
        </Link>
      </div>

      <div className='max-w-screen-xl mx-auto p-3 md:p-10 flex flex-col gap-8'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-10'>
              <h2 className='text-4xl font-semibold text-slate-700 text-center'>Гарячі Пропозиції</h2>
              <Link className='text-s text-green-700 hover:underline block text-center' to={'/search?offer=true'}>
                Показати всі ГАРЯЧІ пропозиції
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto relative'>
              {offerListings.map((listing) => (
                <div className='relative' key={listing._id}>
                  <div className='absolute top-0 left-0 text-white p-2 rounded-br-lg z-10 text-xs font-medium transform scale-80'
                      style={{
                        background: 'linear-gradient(135deg, #50D492 0%, #4EDDA6 25%, #48DABF 50%, #45DCD4 75%, #42DEE8 100%)'
                      }}>
                    Гаряче🔥 {listing.offer ? `$${listing.regularPrice - listing.discountPrice} ЗНИЖКА` : ''}
                  </div>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-10'>
              <h2 className='text-4xl font-semibold text-slate-700 text-center'>Чудові Місця для Оренди</h2>
              <Link className='text-s text-green-700 hover:underline block text-center' to={'/search?type=rent'}>
                Показати доступні місця для оренди
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto relative'>
              {rentListings.map((listing) => (
                <div className='relative' key={listing._id}>
                  <div className='absolute top-0 left-0 bg-cyan-400 text-white p-2 rounded-br-lg z-10 text-xs font-medium transform scale-80'>
                    Оренда🏠 {listing.offer ? `$${listing.regularPrice - listing.discountPrice} ЗНИЖКА` : ''}
                  </div>

                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-10'>
              <h2 className='text-4xl font-semibold text-slate-700 text-center'>Чудові Місця для Продажу</h2>
              <Link className='text-s text-green-700 hover:underline block text-center' to={'/search?type=sale'}>
                Показати доступні об'єкти для продажу
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto relative text-xs font-medium transform scale-80'>
              {saleListings.map((listing) => (
                <div className='relative' key={listing._id}>
                  <div className='absolute top-0 left-0 bg-green-400 text-white p-2 rounded-br-lg z-10'>
                    Продаж💸 {listing.offer ? `$${listing.regularPrice - listing.discountPrice} ЗНИЖКА` : ''}
                  </div>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
