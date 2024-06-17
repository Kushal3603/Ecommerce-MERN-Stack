import React from 'react'
import { Link } from 'react-router-dom'
import ReactStars from 'react-stars'

const SpecialProduct = () => {
  return (
    <div className='col-6 mb-3'>
      <div className='special-product-card'>
        <div className='d-flex justify-content-between'>
          <div>
            <img src='images/watch.jpg' className='img-fluid' alt='watch'/>
          </div>
          <div className='special-product-content'>
            <h5 className='brand'>Samsung</h5>
            <h6 className='title'>Samsung Watch 5</h6>
            <ReactStars count={5} size={24} value={3} edit={false} color2='#ffd700' />
            <p className='price'>
              <span className='red-p'>&#8377;25999</span>&nbsp; <strike>&#8377;29999</strike>
            </p>
            <div className='discount-till d-flex align-items-center gap-10'>
              <p className='mb-0'><b style={{marginLeft:'-14px'}}>5 </b>days</p>
              <div className='d-flex gap-10 align-items-center'>
                <span className='badge rounded-circle p-3 bg-danger'>1</span>:
                <span className='badge rounded-circle p-3 bg-danger'>1</span>:
                <span className='badge rounded-circle p-3 bg-danger'>1</span>
              </div>
            </div>
            <div className='prod-count mt-3'>
                <p>Products: 5</p>
                <div className='progress'>
                  <div className='progress-bar'
                  role='progressbar'
                  style={{width:'25%'}}
                  aria-valuenow='25'
                  aria-valuemin={0}
                  aria-valuemax={100}
                  >
                  </div>
                </div>
            </div>
            <Link className='button my-3'>Add to Cart</Link>
          </div>  
        </div>
      </div>
    </div>
  )
}

export default SpecialProduct