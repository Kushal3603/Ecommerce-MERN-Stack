const Category=require('../models/categoryModel')
const asyncHandler=require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodb');


const createCategory=asyncHandler(async(req,res)=>{
    try{
        const newCategory=await Category.create(req.body)
        res.json(newCategory)
    }

    catch(err){
        throw new Error(err)
    }
})

const updateCategory=asyncHandler(async(req,res)=>{
    validateMongoDbId(id)
    const {id}=req.params
    try{
        const updatedCategory=await Category.findByIdAndUpdate(id,req.body,{
            new:true
        })
        res.json(updatedCategory)

    }
    catch(err){
        throw new Error(err)
    }
})

const deleteCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const deletedCategory=await Category.findByIdAndDelete(id)
        res.json(deletedCategory)
    }
    catch(err){
        throw new Error(err)
    }
})

const getCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const getACategory=await Category.findById(id)
        res.json(getACategory)
    }
    catch(err){
        throw new Error(err)
    }

})

const getAllCategories=asyncHandler(async(req,res)=>{
    try{
    const getCategories=await Category.find()
    res.json(getCategories)
    }
    catch(err){
        throw new Error(err)
    }
})
module.exports={createCategory,updateCategory,deleteCategory,getCategory,getAllCategories}