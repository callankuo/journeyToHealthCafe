import React, { useEffect} from 'react'
import Meta from '../components/Meta'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
//import products from '../products'
import {Button, Row, Col} from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Message from '../components/Message'
import {listProducts} from '../actions/productActions'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = ({match}) => {

    const category = match.params.category
    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1


    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages} = productList

    useEffect( () => {
        dispatch(listProducts(category, keyword, pageNumber))
    } , [dispatch, category, keyword, pageNumber]
    )

    return (
        <>
        <Meta />
        {!keyword && !category ? (<ProductCarousel/>) :(
            <Link to='/' className='btn btn-light'>
                Go Back
            </Link>
        ) }
            <h3>Journey To Good Health Menu</h3>
            <Button variant="outline-primary" href="/category/Appetizer" active={category === 'Appetizer'}>Appetizer</Button>{' '}
            <Button variant="outline-secondary" href="/category/Side" active={category === 'Side'}>Side</Button>{' '}
            <Button variant="outline-success" href="/category/Salad" active={category === 'Salad'}>Salad</Button>{' '}
            <Button variant="outline-warning" href="/category/Entree" active={category === 'Entree'}>Entree</Button>{' '}
            <Button variant="outline-danger" href="/category/Collard Green Wrapnics" active={category === 'Collard Green Wrapnics'}>Collard Green Wrapnics</Button>{' '}
            <Button variant="outline-info" href="/category/Beverage" active={category === 'Beverage'}>Beverage</Button>
            {loading ? (<Loader />)
            : error ? (<Message variant='danger'>{error}</Message>)
            : (
                <>
            <Row>
                {
                    products.map(product => (
                        <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                            <Product product = {product} />
                        </Col>

                    )
                    )
                }
            </Row>
            <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} category={category ? category : ''}/>
            </>
            )}
        </>
    )
}
export default HomeScreen