class ApiFeatures{
	constructor(query, queryStr){
		this.query = query;
		this.queryStr = queryStr;
	}

	filter(){
		const queryFilter = {...this.queryStr};
		
		const exclude = ['page', 'limit', 'sort', 'fields'];
		exclude.forEach(el => delete queryFilter[el]);
		let queryString = JSON.stringify(queryFilter);
		
		queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
		
		this.query = this.query.find(JSON.parse(queryString));
		return this;
	}

	sort(){
		if(this.queryStr.sort){
			const sortBy = this.queryStr.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		}else{
			this.query = this.query.sort("-createdAt");
		}
		return this;
	}

	fieldLimit(){
		if(this.queryStr.fields){
			const selectBy = this.queryStr.fields.split(",").join(" ");
			this.query = this.query.select(selectBy);
		}else{
			this.query = this.query.select("-__v");
		}
		return this;
	}

	paginate(){
		if(this.queryStr.page){
			const page = this.queryStr.page;
			const limit = this.queryStr.limit || 100;
			const skip = (page - 1) * limit;

			this.query = this.query.skip(skip).limit(limit);
		}else{
			this.query = this.query.skip(0).limit(100);
		}
		return this;
	}
}

module.exports = ApiFeatures;