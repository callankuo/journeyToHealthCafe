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
import {listProducts} from '../actions/productActions'
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
    console.log('deliveryMethod = '+ deliveryMethod)
    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages} = productList

    const [modalShow, setModalShow] = useState(deliveryMethod && deliveryMethod.method ? false : true);

    useEffect( () => {
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
                <LinkContainer to='/category/Appetizer'>
                    <Nav.Link>
                      Appetizer
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to='/category/Side'>
                    <Nav.Link>
                      Side
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to='/category/Salad'>
                    <Nav.Link>
                      Salad
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to='/category/Entree'>
                    <Nav.Link>
                      Entree
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to='/category/Collard Green Wrapnics'>
                    <Nav.Link>
                    Collard Green Wrapnics
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to='/category/Beverage'>
                    <Nav.Link>
                      Beverage
                    </Nav.Link>
                </LinkContainer>
            </Nav>
            </Container>
            </Navbar>
        
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