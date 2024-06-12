const express=require('express')

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getAllEnquiries } = require('../controller/enqContoller')
const router=express.Router()

router.post('/',authMiddleware,isAdmin,createEnquiry)
router.put('/:id',authMiddleware,isAdmin,updateEnquiry)
router.delete('/:id',authMiddleware,isAdmin,deleteEnquiry)
router.get('/:id',getEnquiry)
router.get('/',getAllEnquiries)
module.exports=router