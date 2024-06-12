const Color=require('../models/colorModel')
const asyncHandler=require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodb');


const createColor=asyncHandler(async(req,res)=>{
    try{
        const newColor=await Color.create(req.body)
        res.json(newColor)
    }

    catch(err){
        throw new Error(err)
    }
})

const updateColor=asyncHandler(async(req,res)=>{
    
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const updatedColor=await Color.findByIdAndUpdate(id,req.body,{
            new:true
        })
        res.json(updatedColor)

    }
    catch(err){
        throw new Error(err)
    }
})

const deleteColor=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const deletedColor=await Color.findByIdAndDelete(id)
        res.json(deletedColor)
    }
    catch(err){
        throw new Error(err)
    }
})

const getColor=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const getAColor=await Color.findById(id)
        res.json(getAColor)
    }
    catch(err){
        throw new Error(err)
    }

})

const getAllColors=asyncHandler(async(req,res)=>{
    try{
    const getColors=await Color.find()
    res.json(getColors)
    }
    catch(err){
        throw new Error(err)
    }
})
module.exports={createColor,updateColor,deleteColor,getColor,getAllColors}