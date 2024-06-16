import React from 'react'
import { Link } from 'react-router-dom'
import ReactStars from 'react-stars'

const ProductCard = () => {
  return (
    <div className='col-3'>
        <Link className='product-card position-relative'>
            <div className='wishlist-icon position-absolute'>
                <Link><img src='images/wish.svg' alt='wishlist'></img></Link>
            </div>
            <div className='product-image'>
                <img src='images/marshall.jpg' alt='product' style={{padding:'10px 10px 10px 30px'}}/>
                <img src='images/marshall-1.jpg' alt='product'
                style={{padding:'10px'}}/>
            </div>
            <div className='product-details'>
                <h6 className='brand'>Marshall</h6>
                <h5 className='product-title'>Marshall Major IV </h5>
                <ReactStars count={5} size={24} value={3} edit={false} color2='#ffd700' ></ReactStars>
                <p className='price'>&#8377;10000</p>
            </div>
            <div className='action-bar position-absolute'>
                <div className='d-flex flex-column gap-15'>
                    <Link><img src='images/prodcompare.svg' alt='compare'/></Link> 
                    <Link><img src='images/view.svg' alt='view'/></Link>
                    <Link><img src='images/add-cart.svg' alt='cart'/></Link>   
                </div>
            </div>
        </Link>
    </div>
  )
}

export default ProductCard