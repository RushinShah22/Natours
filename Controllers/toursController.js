const Tour = require("./../Model/tourModel");
const catchAsyncError = require("./../utils/catchAsyncError");
const {deleteOne, updateOne, getAll, createOne, getOne} = require("./handlerFactory")



exports.deleteTour = deleteOne(Tour);
exports.patchTour = updateOne(Tour);
exports.getAllTours = getAll(Tour);
exports.getATour = getOne(Tour, {path: "reviews"});
exports.createTour = createOne(Tour);



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