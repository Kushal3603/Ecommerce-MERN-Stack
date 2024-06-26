const { generateToken } = require('../config/jwtToken');
const User=require('../models/userModel')
const asyncHandler=require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodb');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt=require('jsonwebtoken');
const sendEmail = require('./emailController');
const crypto=require('crypto')
const Cart=require('../models/cartModel')
const Product=require('../models/productModel')
const Coupon=require('../models/couponModel')
const Order=require('../models/orderModel')
const uniqid=require('uniqid')

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

const loginAdmin=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const findAdmin=await User.findOne({email})
    if(findAdmin.role!=='admin') throw new Error('Not authorised')
    if(findAdmin && (await findAdmin.isPasswordMatched(password))){
        const refreshToken=await generateRefreshToken(findAdmin?._id)
        const updateUser=await User.findByIdAndUpdate(findAdmin.id,
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
            _id:findAdmin?._id,
            firstname:findAdmin?.firstname,
            lastname:findAdmin?.lastname,
            email:findAdmin?.email,
            password:findAdmin?.password,
            token:generateToken(findAdmin?._id)
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
            html:resetURL
        }
        sendEmail(data)
        res.json(token)
    }
        catch(err){
            throw new Error("User not found with this email")
        }
    
})

const resetPassword=asyncHandler(async(req,res)=>{
    const {password}=req.body
    const {token}=req.params
    const hashedToken=crypto.createHash('sha256').update(token).digest("hex")
    const user=await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt:Date.now()}
        
    })
    if(!user) throw new Error("Token expired. Please try again later.")
    user.password=password
    user.passwordResetToken=undefined
    user.passwordResetExpires=undefined
    await user.save()
    res.json(user)
})

const getWishlist=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    try{
        const findUser=await User.findById(_id).populate("wishlist")
        res.json(findUser)
    }
    catch(err){
        throw new Error(err)
    }
})

const saveAddress=asyncHandler(async(req,res,next)=>{
    const {_id}=req.user
    validateMongoDbId(_id)
    try{
        const updatedUser=await User.findByIdAndUpdate(_id,
            {
                address:req?.body?.address
            },
            {
                new:true
            }
        )
        res.json(updatedUser)

    }
    catch(err){
        throw new Error(err)
    }

})

const userCart=asyncHandler(async(req,res)=>{
    const {cart}=req.body
    const {_id}=req.user
    validateMongoDbId(_id)
    try{
        const products=[]
        const user=await User.findById(_id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const alreadyExist=await Cart.findOne({orderby:user._id})
        if(alreadyExist){
            alreadyExist.deleteOne()
        }
        for(let i=0;i<cart.length;i++){
            let object={}
            object.product=cart[i]._id
            object.count=cart[i].count
            object.color=cart[i].color
            let getPrice=await Product.findById(cart[i]._id).select("price").exec()
            object.price=getPrice.price
            products.push(object)
        }
        let cartTotal=0;
        for(let i=0;i<products.length;i++){
            cartTotal+=products[i].price*products[i].count
        }
        let newCart=await new Cart({
            products,
            cartTotal,
            orderby:user?._id
        }).save()
        res.json(newCart)
        console.log(cartTotal)
    }catch(err){
        throw new Error(err)
    }
})

const getUserCart=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    validateMongoDbId(_id)
    try{
        const cart=await Cart.findOne({orderby:_id}).populate("products.product")
        res.json(cart)
    }
    catch(err){
        throw new Error(err)
    }
})

const emptyCart=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    validateMongoDbId(_id)
    try{
        const user=await User.findOne({_id})
        const cart=await Cart.findOneAndDelete({orderby:user._id})
        res.json(cart)
    }
    catch(err){
        throw new Error(err)
    }
})

const applyCoupon=asyncHandler(async(req,res)=>{
    const {coupon}=req.body
    const {_id}=req.user
    const validCoupon=await Coupon.findOne({name:coupon})
    if(validCoupon===null){
        throw new Error("Invalid Coupon")
    }
    const user=await User.findOne({_id})
    let {products,cartTotal}=await Cart.findOne({
        orderby:user._id
    }).populate("products.product")
    let totalAfterDiscount=(
        cartTotal-(cartTotal*validCoupon.discount)/100
    ).toFixed(2)
    await Cart.findOneAndUpdate(
        {
            orderby:user._id
        },
        {
            totalAfterDiscount
        },
        {
            new:true
        },
        
    )
    res.json(totalAfterDiscount)
})

const createOrder=asyncHandler(async(req,res)=>{
    const {COD,couponApplied}=req.body
    const {_id}=req.user
    validateMongoDbId(_id)
    try{
        if(!COD) throw new Error('Create cash order failed')
        const user=await User.findById(_id)
        let userCart=await Cart.findOne({orderby:user._id})
        let finalAmount=0
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount=userCart.totalAfterDiscount
        }
        else{
            finalAmount=userCart.cartTotal
        }
        let newOrder=await new Order({
            products:userCart.products,
            paymentIntent:{
                id:uniqid(),
                method:"COD",
                amount:finalAmount,
                status:"Cash On Delivery",
                created:Date.now(),
                currency:"inr",
            },
            orderby:user._id,
            orderStatus:"Cash On Delivery"
        }).save()
        let update=userCart.products.map((item)=>{
            return {
                updateOne:{
                    filter:{_id:item.product._id},
                    update:{$inc:{quantity:-item.count,sold:+item.count}}
                }
            }
        })
        const updated=await Product.bulkWrite(update,{})
        res.json({message:"success"})
    }
    catch(err){
        throw new Error(err)
    }   
})

const getOrders=asyncHandler(async(req,res)=>{
    const {_id}=req.user
    validateMongoDbId(_id)
    try{
        const userOrders=await Order.findOne({orderby:_id}).populate("products.product  ")
        res.json(userOrders)

    } 
    catch(err){
        throw new Error(err)
    }   
})

const updateOrderStatus=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const {status}=req.body
    validateMongoDbId(id)
    try{
        const updatedStatus=await Order.findByIdAndUpdate(id,{
            orderStatus:status,
            paymentIntent:{
                status:status
            }
        },
        {new:true}
        )
        res.json(updatedStatus)
    }
    catch(err){
        throw new Error(err)
    }
})

module.exports={createUser,loginUserController,getAllUsers,getUser,deleteUser,updateUser,blockUser,unblockUser,handleRefreshToken,logout,updatePassword,forgotPasswordToken,resetPassword,loginAdmin,getWishlist,saveAddress,userCart,getUserCart,emptyCart,applyCoupon,createOrder,getOrders,updateOrderStatus}