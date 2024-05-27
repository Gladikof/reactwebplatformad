import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-lg overflow-hidden'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0] || 'https://dummyimage.com/300.png/09f/fff'}
          alt='Фото оголошення'
          className='h-[280px] w-full object-cover hover:scale-105 transition duration-400'
        />
        <div className='p-4'>
          <p className='text-lg font-semibold text-slate-700'>{listing.name}</p>
          <div className='flex items-center gap-1 text-gray-600'>
            <MdLocationOn className='h-5 w-5 text-green-700' />
            <p className='truncate'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
          <div className='flex justify-between items-center mt-2'>
            <p className='text-slate-500 font-semibold'>
              ${listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / місяць'}
            </p>
            <div className='text-slate-700 flex gap-2 text-base'>
              <div className='font-semibold'>
                {listing.bedrooms > 1 ? `${listing.bedrooms} Кімнати` : `${listing.bedrooms} Кімната`}
              </div>
              <div className='font-semibold'>
                {listing.bathrooms > 1 ? `${listing.bathrooms} Ванні кімнати` : `${listing.bathrooms} Ванна кімната`}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
