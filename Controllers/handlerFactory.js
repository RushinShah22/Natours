const catchAsyncError = require("./../utils/catchAsyncError");
const AppError = require("./../utils/appError");
const ApiFeatures = require("./../utils/apiFeatures");


module.exports.deleteOne = Model => catchAsyncError(async (req, res, next) => {
	
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc)throw new AppError(`Can't find document with ID: ${req.params.id}`, 404, "fail");
    
    res.status(200).json({
        status: "success",
        data:{
            data: doc
        }
    })

});

module.exports.updateOne = Model => catchAsyncError(async (req, res, next) => {


    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    })

    if(!doc)throw new AppError(`Can't find document with ID: ${req.params.id}`, 404, "fail");

    res.status(201).json({
        status: "success",
        data:{
            data: doc
        }
    })

});


module.exports.getAll = (Model, popOpts) => catchAsyncError(async (req, res, next) => {
	
    const features = new ApiFeatures(Model, req.query);
    
    // const features = Tour.find();
    
    let query = features.filter().sort().fieldLimit().paginate().query;
    if(popOpts)query.populate(popOpts);
    const docs = await query;

    res.status(200).json({
        status: "success",
        len: docs.length,
        data: {
            data: docs
        }
    });

});


module.exports.createOne = Model => catchAsyncError(async (req, res, next) => {
	
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: "success",
        data:{
            data: doc
        }
    })

});

module.exports.getOne = (Model, popOpts) => catchAsyncError( async (req, res, next) =>{
	
    let query = Model.findById(req.params.id);
    if(popOpts) query.populate(popOpts);
    const doc = await query;
    if(!doc)throw new AppError(`Can't find document with ID: ${req.params.id}`, 404, "fail");

    res.status(200).json({
        status: "success",
        data: {
            data: doc
        }
    });

});