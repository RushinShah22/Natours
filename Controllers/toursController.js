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

exports.tourStats = async (req, res) => {
	try{
		const stats = await Tour.aggregate([
			{ 
				$match: {ratingsAverage: { $gte : 4.5}}
			},
			{
				$group: {
					_id: { $toUpper: '$difficulty'},
					toursNum: { $sum: 1},
					avgRating: { $avg: '$ratingsAverage'},
					avgPrice: { $avg: '$price'},
					minPrice: { $min : '$price'},
					maxPrice: {$max : '$price'}

				}
			},
			{
				$sort: { minPrice: -1}
			}
		])

		res.status(200).json({
			status: "success",
			data:{
				stats
			}
		})
	}catch(err){
		res.status(400).json({
			status: "fail",
			err
		})
	}
}

exports.monthlyPlan = async (req, res) => {
	try{
		const year = req.params.year * 1;
		const plan = await Tour.aggregate([
			{
				$unwind: '$startDates'
			},
			{
				$match: { 
					startDates : { 
						$gte: new Date(`${year}-01-01`), $lte : new Date(`${year}-12-31`)
					}
				}
			},
			{
				$group: {
					_id: { $month : '$startDates'},
					numsOfTours: { $sum : 1},
					tours: { $push: '$name'},
				}
			},
			{
				$addFields : {
					month: '$_id'
				}
			},
			{
				$project: {
					_id: 0
				}
			},
			{
				$sort: {
					numsOfTours: -1
				}
			}
		]);

		res.status(200).json({
			status: "success",
			data:{
				plan
			}

		})

	} catch(err){
		res.status(400).json({
			status: "fail",
			err
		})
	}
}