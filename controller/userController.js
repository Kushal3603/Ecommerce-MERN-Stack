const { generateToken } = require('../config/jwtToken');
const User=require('../models/userModel')
const asyncHandler=require('express-async-handler')
const createUser=asyncHandler(async (req,res)=>{
    const email=req.body.email;
    const findUser=await User.findOne({email:email})
    if(!findUser){
        const newUser=await User.create(req.body)
        res.json(newUser)
    }
    else{
        throw new Error('User already exists.')
    }
})

const loginUserController=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const findUser=await User.findOne({email})
    if(findUser && await findUser.isPasswordMatched(password)){
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            password:findUser?.password,
            token:generateToken(findUser?._id)
        })
    }
    else{
        throw new Error("Invalid Credentials.")
    }
    console.log(email,password)
})

const getAllUsers=asyncHandler(async(req,res)=>{
    try{
        const getUsers=await User.find()
        res.json(getUsers)
    }
    catch(err){
        throw new Error(err)
    }
})

const getUser=asyncHandler(async (req,res)=>{
    console.log(req.params)
    const {id}=req.params
    try{
        const getAUser=await User.findById(id)
        res.json({
            getAUser
        })
    }
    catch(err){
        throw new Error(err)
    }
})

const deleteUser=asyncHandler(async (req,res)=>{
    console.log(req.params)
    const {id}=req.params
    try{
        const deleteAUser=await User.findByIdAndDelete(id)
        res.json({
            deleteAUser
        })
    }
    catch(err){
        throw new Error(err)
    }
})

const updateUser=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        const updatedUser=await User.findByIdAndUpdate(id,{
            firstname:req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile
        },
    {
        new:true
    })
    res.json({updatedUser})
    }
    catch(err){
        throw new Error(err)
    }
})

module.exports={createUser,loginUserController,getAllUsers,getUser,deleteUser,updateUser}