const express=require('express')
const { createProduct, getProduct, getAllProducts, updateProduct } = require('../controller/productController')
const router=express.Router()

router.post('/',createProduct)
router.get('/:id',getProduct)
router.get('/',getAllProducts
)
router.put('/:id',updateProduct)
module.exports=router