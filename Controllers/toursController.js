const Tour = require("./../Model/tourModel");
const ApiFeatures = require("./../utils/apiFeatures");


exports.getAllTours = async (req, res) => {
	try{
		const features = new ApiFeatures(Tour, req.query);
		// const features = Tour.find();
		const tours = await features.filter().sort().fieldLimit().paginate().query;

		res.status(200).json({
			status: "success",
			numberOfTour: tours.length,
			data: {
				tours
			}
		});
	}catch(err){
		res.status(400).json({
			status: "fail",
			err
		})
	}

};

exports.getATour = async (req, res) =>{
	try{
		await Tour.findById(req.params.id);
		res.status(200).json({
			status: "success",
		});
	}catch(err){
		res.status(400).json({
			status: "fail",
			err
		})
	}
};

exports.createTour = async (req, res) => {
	try{
		const tour = await Tour.create(req.body);
		res.status(201).json({
			status: "success",
			data:{
				tour
			}
		})
	}catch(err){
		res.status(400).json({
			status: "fail",
			err
		})
	}
};

exports.patchTour = async (req, res) => {

	try{
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			runValidators: true,
			new: true
		})

		res.send(201).json({
			status: "success",
			data:{
				tour
			}
		})
	}catch(err){
		res.status(400).json({
			status: "fail",
			err
		})
	}
};

exports.deleteTour = async (req, res) => {
	try{
		const tour = await Tour.findByIdAndDelete(req.params.id);
		res.status(200).json({
			status: "success",
			data:{
				tour
			}
		})
	}catch(err){
		res.status(400).json({
			status: "fail",
			err
		})
	}
};