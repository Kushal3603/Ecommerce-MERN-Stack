const express=require('express')
const { createUser, loginUserController, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout } = require('../controller/userController')
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')
const router=express.Router()

router.post('/register',createUser)
router.post("/login",loginUserController)
router.get('/allUsers',getAllUsers)
router
.get('/refresh',handleRefreshToken)
router
.get('/logout',logout)
router.get('/:id',authMiddleware, isAdmin, getUser)

router.delete('/:id',deleteUser)
router.put('/editUser',authMiddleware, isAdmin, updateUser)
router.put('/blockUser/:id',authMiddleware,isAdmin,blockUser)
router
.put('/unblockUser/:id',authMiddleware,isAdmin,unblockUser)


module.exports=router   