const express=require('express')
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, deleteImages } = require('../controller/productController')
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages')
const router=express.Router()

router.post('/',authMiddleware, isAdmin, createProduct)

router.put('/wishlist',authMiddleware, addToWishlist)
router.put('/upload',authMiddleware,isAdmin, uploadPhoto.array("images",10),productImgResize,uploadImages)
router.delete('/delete/:id',authMiddleware,isAdmin,deleteImages)
router.put('/rating',authMiddleware, rating)
router.get('/:id',getProduct)
router.get('/',getAllProducts
)
router.delete('/:id',authMiddleware, isAdmin,deleteProduct
)
router.put('/:id',authMiddleware, isAdmin,updateProduct)

module.exports=router