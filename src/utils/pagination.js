export const paginate=async({page=parseInt(process.env.PAGE),size=parseInt(process.env.SIZE),model,filter={},populate='',select='',sort= {createdAt:-1}}={})=>{
    let limit = parseInt(size<=0 ? 1 : size)
    const skip=(parseInt(((page>0?page:1)  -1)) * (limit))
    console.log(filter,populate);
    const count = await model.find(filter).countDocuments()
    const results = await model.find(filter).populate(populate).select(select).sort(sort).skip(skip).limit(limit)
    console.log(results);
    

    return {results,count,page,limit}

}