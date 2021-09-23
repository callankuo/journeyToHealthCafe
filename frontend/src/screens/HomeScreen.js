import React, { useState, useEffect } from 'react'
import Meta from '../components/Meta'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
//import products from '../products'
import {LinkContainer} from 'react-router-bootstrap'
import {Container, Navbar, Nav, Row, Col} from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Message from '../components/Message'
import {listProducts, listTopCategories} from '../actions/productActions'
import {saveDeliverytMethod} from '../actions/cartActions'
import ProductCarousel from '../components/ProductCarousel'
import DeliveryMethodModal from '../components/DeliveryMethodModal'

const HomeScreen = ({match}) => {
    
    

    const category = match.params.category
    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1


    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { deliveryMethod } = cart
    const categoriesTop = useSelector((state) => state.categoriesTop)
    const {loading: loadingCategories, error: errorCategories, categories } = categoriesTop

   
        
    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages} = productList

    const [modalShow, setModalShow] = useState(deliveryMethod && deliveryMethod.method ? false : true);

    useEffect( () => {
        dispatch(listTopCategories())
        dispatch(listProducts(category, keyword, pageNumber))
        
        const table = match.params.id
        
        console.log('table = '+table)
        const deliveryM = table? {method: 'dineIn', agent: table} : deliveryMethod
        dispatch(saveDeliverytMethod(deliveryM))
        // eslint-disable-next-line
    } , [dispatch, category, keyword, pageNumber]
    
    )
    
    return (
        <>
        <Meta />
        {!keyword && !category ? (<ProductCarousel/>) :(
            <Link to='/' className='btn btn-success'>
                Go Back
            </Link>
        ) }
       
       {loadingCategories ? (<Loader />)
            : errorCategories ? (<Message variant='danger'>{errorCategories}</Message>)
            : (
                <>
        <h3>Journey To Good Health Menu</h3>
                
            <Navbar bg='success' variant="light" expand="lg" collapseOnSelect>
            <Container>
            <LinkContainer to='/'>
                <Navbar.Brand>
                    <img
                    src="/images/journeycafe.png"
                    width="140"
                    height="60"
                    className="d-inline-block align-top"
                    alt="Journey Cafe"
                    />
                </Navbar.Brand>
            </LinkContainer>
            <Nav variant='tabs'>
            {
                categories.map(category => (
                
                <LinkContainer to={`/category/${category.name}`}>
                    <Nav.Link>
                      {category.name}
                    </Nav.Link>
                </LinkContainer>
                
                
                ))}
            </Nav>
            </Container>
            </Navbar>
                </>
            )}

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
             <DeliveryMethodModal
                table = {match.params.id? match.params.id :''}
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    )
}
export default HomeScreen