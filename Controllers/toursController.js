const AppError = require("../utils/appError");
const Tour = require("./../Model/tourModel");
const ApiFeatures = require("./../utils/apiFeatures");
const catchAsyncError = require("./../utils/catchAsyncError");


exports.getAllTours = catchAsyncError(async (req, res, next) => {
	
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

});

exports.getATour = catchAsyncError( async (req, res, next) =>{
	
		const tour = await Tour.findById(req.params.id);
		if(!tour)throw new AppError(`Can't find Tour with ID: ${req.params.id}`, 404, "fail");

		res.status(200).json({
			status: "success",
			tour
		});
	
});

exports.createTour = catchAsyncError(async (req, res, next) => {
	
		const tour = await Tour.create(req.body);

		res.status(201).json({
			status: "success",
			data:{
				tour
			}
		})
	
});

exports.patchTour = catchAsyncError(async (req, res, next) => {

	
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			runValidators: true,
			new: true
		})

		if(!tour)throw new AppError(`Can't find Tour with ID: ${req.params.id}`, 404, "fail");

		res.send(201).json({
			status: "success",
			data:{
				tour
			}
		})
	
});

exports.deleteTour = catchAsyncError(async (req, res, next) => {
	
		const tour = await Tour.findByIdAndDelete(req.params.id);

		if(!tour)throw new AppError(`Can't find Tour with ID: ${req.params.id}`, 404, "fail");
		
		res.status(200).json({
			status: "success",
			data:{
				tour
			}
		})
	
});

exports.tourStats = catchAsyncError(async (req, res, next) => {
	
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
	
});

exports.monthlyPlan = catchAsyncError(async (req, res, next) => {
	
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

	
});