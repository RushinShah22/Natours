const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
	name: {
		required: [true, "A tour must have a name."],
		type: String,
		unique: true
	},

	rating:{
		default: 4.5,
		type: Number
	},

	price: {
		required: [true, "A tour must have a price."],
		type: Number
	}
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;