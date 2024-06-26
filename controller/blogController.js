const Blog=require('../models/blogModel')
const User=require('../models/userModel')
const asyncHandler=require('express-async-handler')
const validateMongoDbId=require('../utils/validateMongodb')
const blogModel = require('../models/blogModel')

const createBlog=asyncHandler(async(req,res)=>{
    try{
        const newBlog=await Blog.create(req.body)
        res.json({
            status:"success",
            newBlog,

        })

    }
    catch(err){
        throw new Error(err)
    }
})

module.exports={createBlog}