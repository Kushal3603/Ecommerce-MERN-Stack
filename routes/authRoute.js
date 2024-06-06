const express=require('express')
const { createUser, loginUserController, getAllUsers, getUser, deleteUser, updateUser } = require('../controller/userController')
const router=express.Router()

router.post('/register',createUser)
router.post("/login",loginUserController)
router.get('/allUsers',getAllUsers)
router.get('/:id',getUser)
router.delete('/:id',deleteUser)
router.put('/:id',updateUser)
module.exports=router   