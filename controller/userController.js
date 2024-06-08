const { generateToken } = require('../config/jwtToken');
const User=require('../models/userModel')
const asyncHandler=require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodb');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt=require('jsonwebtoken');
const sendEmail = require('./emailController');

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
    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken=await generateRefreshToken(findUser?._id)
        const updateUser=await User.findByIdAndUpdate(findUser.id,
            {
                refreshToken: refreshToken
            },
            {
                new:true
            },
        )
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000
        })
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
    validateMongoDbId(id)
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
    const {id}=req.params
    validateMongoDbId(id)
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

const handleRefreshToken=asyncHandler(async(req,res)=>{
    const cookie=req.cookies
    if(!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
    const refreshToken=cookie.refreshToken
    const user=await User.findOne({refreshToken})
    if(!user) throw new Error('No refresh token present in db ')
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err || user.id!==decoded.id){
            throw new Error("There is something wrong  with refresh token")
        }
        const accessToken=generateToken(user?._id)
        res.json({accessToken})
    })   
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken)
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate({refreshToken}, {
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
  });

const updateUser=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    validateMongoDbId(_id)
    try{
        const updatedUser=await User.findByIdAndUpdate(_id,{
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

const blockUser=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
try{
    const block=await User.findByIdAndUpdate(id,{
        isBlocked:true
    },
    {
        new:true
    })
    res.json({message:"User Blocked"})
}

catch(err){
    throw new Error(err)
}

})
const unblockUser= asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
try{
    const unblock=await User.findByIdAndUpdate(id,{
        isBlocked:false
    },
    {
        new:true
    })
    res.json({message:"User Unblocked"})
}
catch(err){
    throw new Error(err)
}

})


const updatePassword=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    const {password}=req.body
    validateMongoDbId(_id)
    const user=await User.findById(_id)
    if(password){
        user.password=password
        const updatedPassword=await user.save()
        res.json(updatedPassword)
    }
    else{
        res.json(user)
    }
})

const forgotPasswordToken=asyncHandler(async(req,res)=>{
    const {email}=req.body
    const user=await User.findOne({email})
    if(!user) throw new Error("User not found with this email")
    try{
        const token=await user.createPasswordResetToken()
        await user.save()
        const resetURL=`Hi, please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/resetPassword/${token}>Click here</a>`
        const data={
            to:email,
            text:"Hey User",
            subject:"Forgot Password Link",
            htm:resetURL
        }
        sendEmail(data)
        res.json(token)
    }
        catch(err){
            throw new Error("User not found with this email")
        }
    
})
module.exports={createUser,loginUserController,getAllUsers,getUser,deleteUser,updateUser,blockUser,unblockUser,handleRefreshToken,logout,updatePassword,forgotPasswordToken}