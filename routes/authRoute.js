const express=require('express')
const { createUser, loginUserController, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require('../controller/userController')
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')
const router=express.Router()

router.post('/register',createUser)
router.put('/password',authMiddleware,updatePassword)
router.post('/cart',authMiddleware,userCart)
router.get('/getCart',authMiddleware, getUserCart)
router.get('/getOrders',authMiddleware,getOrders)
router.post("/login",loginUserController)
router.post("/adminLogin",loginAdmin)
router.post('/forgotPasswordToken',forgotPasswordToken)
router.put('/update/:id',authMiddleware,updateOrderStatus)
router.put('/resetPassword/:token',resetPassword)
router.get('/allUsers',getAllUsers)
router
.get('/refresh',handleRefreshToken)
router
.get('/logout',logout)
router.get('/wishlist',authMiddleware, getWishlist)
router.delete('/emptyCart',authMiddleware,emptyCart)
router.get('/:id',authMiddleware, isAdmin, getUser)

router.put('/address',authMiddleware,saveAddress)
router.delete('/:id',deleteUser)
router.put('/editUser',authMiddleware, updateUser)
router.put('/blockUser/:id',authMiddleware,isAdmin,blockUser)
router
.put('/unblockUser/:id',authMiddleware,isAdmin,unblockUser)
router.post('/cart/applyCoupon',authMiddleware,applyCoupon)
router.post('/cart/cashOrder',authMiddleware,createOrder)


module.exports=router   