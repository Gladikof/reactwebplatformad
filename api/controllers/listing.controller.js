import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, `Оголошення не знайдено!`));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, `Ви можете видаляти лише свої оголошення!`));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json(`Оголошення було видалено!`);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, `Оголошення не знайдено!`));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, `Ви можете оновлювати лише свої оголошення!`));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, `Оголошення не знайдено!`));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === `false`) {
      offer = { $in: [false, true] };
    } else if (offer === `true`) {
      offer = true;
    } else {
      offer = false;
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === `false`) {
      furnished = { $in: [false, true] };
    } else if (furnished === `true`) {
      furnished = true;
    } else {
      furnished = false;
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === `false`) {
      parking = { $in: [false, true] };
    } else if (parking === `true`) {
      parking = true;
    } else {
      parking = false;
    }

    let type = req.query.type;

    if (type === undefined || type === `all`) {
      type = { $in: ['sale', 'rent'] };
    } else {
      type = type === 'sale' ? 'sale' : 'rent';
    }

    const bedrooms = req.query.bedrooms ? parseInt(req.query.bedrooms) : { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
    const bathrooms = req.query.bathrooms ? parseInt(req.query.bathrooms) : { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    console.log('Fetching listings with the following parameters:', {
      limit,
      startIndex,
      offer,
      furnished,
      parking,
      type,
      bedrooms,
      bathrooms,
      searchTerm,
      sort,
      order,
    });

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
      bedrooms,
      bathrooms,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
