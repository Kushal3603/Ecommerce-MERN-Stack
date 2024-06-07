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
        const allProducts=await Product.find()
        res.json(allProducts)
     }
     catch(err){
         throw new Error(err)
     }
})
module.exports={createProduct,getProduct,getAllProducts,updateProduct}