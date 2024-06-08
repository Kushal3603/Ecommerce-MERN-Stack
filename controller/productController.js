const Product = require("../models/productModel");
const asyncHandler=require('express-async-handler')
const slugify=require('slugify')

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
module.exports={createProduct,getProduct,getAllProducts,updateProduct,deleteProduct}