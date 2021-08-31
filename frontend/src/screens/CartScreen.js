import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import {Card, ListGroup, Row, Col, Image, Button, Form} from 'react-bootstrap'
import Message from '../components/Message'
import {addToCart, removeFromCart} from '../actions/cartActions'
import queryString from 'query-string';
//import { ORDER_DETAILS_RESET } from '../constants/orderConstants'

function CartScreen({ match, location, history}) {
    
    const qValue=queryString.parse(location.search);

    const specialReq = qValue? qValue.specialReq : ''
    const productId = match.params.id
    const qty = qValue? Number(qValue.qty) : 1
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart 

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty,specialReq))
        }
    }, [dispatch, productId, qty, specialReq])
    
    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
       // dispatch({ type: ORDER_DETAILS_RESET})
        history.push('/login?redirect=shipping')
    }
    return (
        <Row>
            <Col md={8}>
                <h1>Shopping cart</h1>
                {!cartItems || cartItems.length === 0 ? <Message>Your Shopping Cart is empty
                      <Link to='/'> Go Back</Link>
                </Message> : ( 
                <ListGroup variant='flush'>
                    {cartItems.map((item) => (
                        <ListGroup.Item key={item.product}>
                            <Row>
                                <Col md={2}>
                                    <Image src={item.image} alt={item.name} fluid rounded />
                                </Col>
                                <Col md={3}>
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                </Col>
                                <Col md={2}>${item.price} </Col>
                                <Col md={2}>P{item.point} </Col>
                                <Col md={2}>
                                <Form.Control
                                            as= 'select'
                                            value = {item.qty}
                                            onChange={(e) =>
                                                dispatch(
                                                  addToCart(item.product, Number(e.target.value),item.specialReq)
                                                )
                                              }
                                        >
                                        {[...Array(item.countInStock).keys()].map(
                                            (x) => (
                                                <option key={x+1} value={x+1}>
                                                        {x+1}
                                                </option>

                                            ))}
                                        </Form.Control>
                                </Col>
                                <Col md={1}>
                                    <Button 
                                        type='button'
                                        variant='light'
                                        onClick={() => removeFromCartHandler(item.product)}
                                    >
                                        <i class='fas fa-trash'></i>
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                            
                                    <Col md={2}><p>Special Request</p></Col>
                                    <Col md={10}>
                                    <Form.Control as='textarea' row='2' value={item.specialReq}
                                    onChange={(e) =>
                                        dispatch(
                                          addToCart(item.product, item.qty, e.target.value)
                                        )
                                      }></Form.Control>
                                    </Col>
                            
                            </Row>
                        </ListGroup.Item>
                    )

                    )

                    }

                </ListGroup>

                )}
            
            </Col>
            <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Subtotal ({cartItems.reduce((acc,item) => acc + item.qty, 0)}) 
                                    items</h2>
                                ${
                                    cartItems.reduce((acc,item) => acc + item.qty * item.price,0).toFixed(2)
                                } {' '}
                                Or {
                                    cartItems.reduce((acc,item) => acc + item.qty * item.point,0)
                                } points
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    Proceed to Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
            </Col>    
        </Row>
    )
}

export default CartScreen
