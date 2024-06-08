const express=require('express')
const { createUser, loginUserController, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require('../controller/userController')
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')
const router=express.Router()

router.post('/register',createUser)
router.put('/password',authMiddleware,updatePassword)
router.post("/login",loginUserController)
router.post('/forgotPasswordToken',forgotPasswordToken)
router.put('/resetPassword/:token',resetPassword)
router.get('/allUsers',getAllUsers)
router
.get('/refresh',handleRefreshToken)
router
.get('/logout',logout)
router.get('/:id',authMiddleware, isAdmin, getUser)

router.delete('/:id',deleteUser)
router.put('/editUser',authMiddleware, updateUser)
router.put('/blockUser/:id',authMiddleware,isAdmin,blockUser)
router
.put('/unblockUser/:id',authMiddleware,isAdmin,unblockUser)


module.exports=router   