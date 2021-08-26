import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'

const ProductCarousel = () => {

    const dispatch = useDispatch()
    const productTopRated = useSelector((state) => state.productTopRated)
    const {loading, error, products } = productTopRated

    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch])

    return loading ? <Loader />: error? <Message variant='danger'>{error}
    </Message> : (
        <Carousel pause='hover' className='color-carousel'>
            {products.map(product => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Carousel.Caption className='carousel-caption'>
                            <h3>{product.name} ${product.price} Or P({product.point})</h3>
                            <h3>{product.description}</h3> 
                        </Carousel.Caption>
                        <Image src={product.image} alter={product.name} fluid />
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
    
}

export default ProductCarousel
