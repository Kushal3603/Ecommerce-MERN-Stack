const Product = require("../models/productModel");
const User=require('../models/userModel')
const asyncHandler=require('express-async-handler')
const slugify=require('slugify');
const validateMongoDbId = require("../utils/validateMongodb");
const {cloudinaryUploadImg,cloudinaryDeleteImg} = require("../utils/cloudinary");

const createProduct=asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const newProduct=await Product.create(req.body)
        res.json(newProduct)
    }
    catch(err){
        throw new Error(err)
    }
})

const updateProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const updatedProduct=await Product.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updatedProduct)
    }
    catch(err){
        throw new Error(err)
    }
})

const deleteProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        
        const deletedProduct=await Product.findByIdAndDelete(id)
        res.json(deletedProduct)
    }
    catch(err){
        throw new Error(err)
    }
})

const getProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        const findProduct=await Product.findById(id)
        res.json(findProduct)
    }
    catch(err){
        throw new Error(err)
    }
})

const getAllProducts=asyncHandler(async(req,res)=>{
     try{
        const queryObj={...req.query}
        const excludeFields=["page","sort","limit","fields"]
        excludeFields.forEach((el)=>delete queryObj[el])

        let queryStr=JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)
    
        let query=Product.find(JSON.parse(queryStr))

        if(req.query.sort){
            const sortBy=req.query.sort.split(",").join(" ")
            query=query.sort(sortBy)
        }
        else{
            query=query.sort("-createdAt")
        }

        if(req.query.fields){
            const fields=req.query.fields.split(",").join(" ")
            query=query.select(fields)
        }
        else{
            query=query.select('-__v')
        }

        const page=req.query.page;
        const limit=req.query.limit
        const skip=(page-1)*limit;
        query=query.skip(skip).limit(limit)

        if(req.query.page){
            const productCount=await Product.countDocuments()
            if(skip>=productCount) throw new Error("This page does not exist")
        }
        console.log(page,limit,skip);

        const product=await query
        res.json(product)

        const allProducts=await Product.where("category").equals(req.query.category)
        res.json(allProducts)

        
        
     }

     
     catch(err){
         throw new Error(err)
     }
})

const filterProduct=asyncHandler(async(req,res)=>{
    const {minprice,maxprice,color,category,availablity,brand}=req.params
    console.log(req.query);

    try{
        const filteredProduct=await Product.find({
            price:{
                $gte:minprice,
                $lte:maxprice
            },
            category,
            brand,
            color
        })
        res.json(filteredProduct)
    }
    catch(err){
        res.json(err)
    }
})

const addToWishlist = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    const {prodId} = req.body;

    try {
        console.log('User ID:', _id);
        console.log('Product ID:', prodId);

        // Validate IDs
        validateMongoDbId(_id);
        validateMongoDbId(prodId);

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);

        let updatedUser;
        if (alreadyAdded) {
            updatedUser = await User.findByIdAndUpdate(
                _id,
                { $pull: { wishlist: prodId } },
                { new: true }
            );
        } else {
            updatedUser = await User.findByIdAndUpdate(
                _id,
                { $push: { wishlist: prodId } },
                { new: true }
            );
        }

        res.json(updatedUser);
    } catch (err) {
        console.error('Error adding to wishlist:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const rating=asyncHandler(async(req,res)=>{
    const{_id}=req.user
    const {comment,star,prodId}=req.body
    try{
        const product=await Product.findById(prodId)
    let alreadyRated=product.ratings.find((userId)=>userId.postedBy.toString()===_id.toString())
    if(alreadyRated){
        const updateRating=await Product.updateOne({
            ratings:{$elemMatch:alreadyRated},
        },
        {
            $set:{"ratings.$.star":star,"ratings.$.comment":comment}
        },
        {
            new:true
        })
    }
    else{
        const rateProduct=await Product.findByIdAndUpdate(prodId,
            {
                $push:{
                    ratings:{
                        star:star,
                        comment:comment,
                        postedBy:_id
                    }
                }
            },
            {
                new:true
            }
        )
    }
    const getAllRatings=await Product.findById(prodId)
    let totalRating=getAllRatings.ratings.length
    let ratingSum=getAllRatings.ratings.map((item)=>item.star).reduce((prev,curr)=>prev+curr,0)
    let actualRating=Math.round(ratingSum/totalRating)
    let finalProduct=await Product.findByIdAndUpdate(prodId,{
        totalRating:actualRating
    },
    {
        new:true
    })
    res.json(finalProduct)
    }
    catch(err){
        throw new Error(err)
    }
})

const uploadImages=asyncHandler(async(req,res)=>{
    try{
        const uploader=async (path)=>await cloudinaryUploadImg(path,"images")
        const urls=[]
        const files=req.files
        for(const file of files){
            const {path}=file
            const newpath=await uploader(path)
            urls.push(newpath)
        }
        const images=urls.map((file)=>{
            return file
        })
        res.json(images)     
    }   
    catch(err){
        throw new Error(err)
    }
})

const deleteImages=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        const deleted=await cloudinaryDeleteImg(id,"images")
        
        res.json({message:"Deleted"})     
    }   
    catch(err){
        throw new Error(err)
    }
})

module.exports={createProduct,getProduct,getAllProducts,updateProduct,deleteProduct,addToWishlist,rating,uploadImages,deleteImages}