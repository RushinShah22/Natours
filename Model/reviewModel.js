const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minLength: [10, 'a review must be atleast 10 characters long.'],
      required: [true, 'a review needs a review.'],
    },
    rating: {
      type: Number,
      required: [true, 'a review must have a rating.'],
      min: 0,
      max: 5,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'a review must belong to a user.'],
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'a review must belong to a tour.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


reviewSchema.pre(/^find/ , function(next){
  this.populate({
    path: "user",
    select: "-createdAt -__v"
  })
  next();
})


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
