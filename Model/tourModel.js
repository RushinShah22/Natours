const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
	name: {
		required: [true, "A tour must have a name."],
		type: String,
		unique: true,
		trim: true
	},
	duration:{
		type: Number,
		required: [true, "a tour must have a duration."]
	},
	maxGroupSize: {
		type: Number,
		required: [true, "A tour must have a group size."]
	},
	difficulty:{
		type: String,
		required: [true, "a tour must have a difficulty."],
		enum : {
			values: ['easy', 'medium', 'difficult'],
			message: "difficulty should be either: easy, medium, or difficult."
		}
	},
	ratingsQuantity:{
		type: Number,
		default: 0
	},
	ratingsAverage:{
		default: 4.5,
		type: Number,
		min: [1, "rating should be atleast 1.0"],
		max: [5, "rating can be atmost 5.0"]
	},

	price: {
		required: [true, "A tour must have a price."],
		type: Number
	},
	priceDiscount: {
		type: Number,
		validate: {
			validator: function(val){
				return this.price >= val;
			},
			message: "Discount ({VALUE}) can be atmost equal to price."
		}
	},
	summary:{
		type: String,
		trim: true,
		required: [true, "A tour must have a summary."],
		maxLength: [200, "Summary can be of atmost 200 characters."]
	},
	description:{
		type: String,
		trim: true,
		maxLength: [1000, "Description can be of atmost 500 characters."]
	},
	imageCover:{
		type: String,
		required: [true, "A tour must have a cover image."]
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	startDates: [Date],
	

});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;