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
