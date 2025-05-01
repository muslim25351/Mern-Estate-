import Listing from "../models/listing.model.js";
import { errorHandler } from "../util/error.js";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(403, "You can delete only your listing"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Listing has been deleted");
  } catch (err) {
    next(err);
  }
};
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //   return next(errorHandler(400, "Invalid listing ID"));
  // }
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(403, "You can update only your listing"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedListing);
  } catch (err) {
    next(err);
  }
};
export const getListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  try {
    return res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || 9);
    const startIndex = parseInt(req.query.startIndex || 0);
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [true, false] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);
    return res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};
