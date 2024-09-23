const Review = require('./../Model/reviewModel');
const catchAsyncError = require('./../utils/catchAsyncError');

module.exports.getReviews = catchAsyncError(async (req, res, next) => {
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

module.exports.createReview = catchAsyncError(async (req, res, next) => {
  let review = req.body;
  if(req.params.tourId)review.tour = req.params.tourId;
  if(req?.user?._id)review.user = req.user._id;
  review = await Review.create(review);

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
