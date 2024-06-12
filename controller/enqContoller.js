const Enquiry=require('../models/enqModel')
const asyncHandler=require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodb');


const createEnquiry=asyncHandler(async(req,res)=>{
    try{
        const newEnquiry=await Enquiry.create(req.body)
        res.json(newEnquiry)
    }

    catch(err){
        throw new Error(err)
    }
})

const updateEnquiry=asyncHandler(async(req,res)=>{
    
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const updatedEnquiry=await Enquiry.findByIdAndUpdate(id,req.body,{
            new:true
        })
        res.json(updatedEnquiry)

    }
    catch(err){
        throw new Error(err)
    }
})

const deleteEnquiry=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const deletedEnquiry=await Enquiry.findByIdAndDelete(id)
        res.json(deletedEnquiry)
    }
    catch(err){
        throw new Error(err)
    }
})

const getEnquiry=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const getAEnquiry=await Enquiry.findById(id)
        res.json(getAEnquiry)
    }
    catch(err){
        throw new Error(err)
    }

})

const getAllEnquiries=asyncHandler(async(req,res)=>{
    try{
    const getEnquiries=await Enquiry.find()
    res.json(getEnquiries)
    }
    catch(err){
        throw new Error(err)
    }
})
module.exports={createEnquiry,updateEnquiry,deleteEnquiry,getEnquiry,getAllEnquiries}