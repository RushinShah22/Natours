const Review = require('./../Model/reviewModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const {deleteOne, updateOne, getAll, createOne, getOne} = require("./handlerFactory");

module.exports.getReviewsOfTour = catchAsyncError(async (req, res, next) => {
  let filter = {};
  if(req.params.tourId)filter.tour = req.params.tourId;
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    len: reviews.length,
    data: {
      reviews,
    },
  });
});

module.exports.setIds = (req, res, next) => {
  if(req.params.tourId)req.body.tour = req.params.tourId;
  if(req?.user?._id)req.body.user = req.user._id;
  next();
}


module.exports.createReview = createOne(Review);
module.exports.deleteReview = deleteOne(Review);
module.exports.updateReview = updateOne(Review);
module.exports.getAllReviews = getAll(Review);
module.exports.getReview = getOne(Review, {path: "tour", select: "name"});