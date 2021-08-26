import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Button, Row, Col, ListGroup, Image, Card, Form} from 'react-bootstrap'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder, getOrderDetails } from '../actions/orderActions'
import { ORDER_EARN_POINT, POINT_DOLLAR_RATE, PROMO_CODE, PROMO_DISCOUNT_RATE} from '../constants/configConstants'
//import axios from 'axios'
//import { ORDER_CREATE_RESET} from '../constants/orderConstants'
//import { cartReset } from '../actions/cartActions'
//import { CART_RESET } from '../constants/cartConstants'

const PlaceOrderScreen = ({history}) => {
    
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin) 
    const { userInfo } = userLogin

    const cart = useSelector((state) => state.cart)
    //calculate price 
    const addDecimals = (num) => {
        return (Math.round(num *100) /100).toFixed(2)
    }
    //calculate order price
    //items subtotal, tax price and total price will change base on 
    //promo amount and apply point. the redispaly on 
    //screen once apply
    const [promo, setPromo] = useState(false)
   // const [promoCode, setPromoCode] = useState('')
    const [promoAmount, setPromoAmount] = useState(0.00)
    const [applyPoint, setApplyPoint] = useState(0)
    const [promoMessage, setPromoMessage]= useState(false)
    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    cart.itemSubTotal = Number(cart.itemsPrice - promoAmount - (applyPoint * POINT_DOLLAR_RATE)).toFixed(2)
    cart.shippingPrice = addDecimals(cart.itemSubTotal > 100 ? 0 : 5.99)
    cart.taxPrice = addDecimals(Number((0.12 * cart.itemSubTotal).toFixed(2)))
    cart.totalPrice = Number(Number(cart.itemSubTotal) + Number(cart.shippingPrice) +
                        Number(cart.taxPrice)).toFixed(2)


    const orderCreate = useSelector(state => state.orderCreate) 
    const { order, success, error } = orderCreate

    useEffect(() => {
        if (success) {
            //dispatch({type: ORDER_CREATE_RESET})
            //dispatch({ type: ORDER_DETAILS_RESET})
            dispatch(getOrderDetails(order._id))
            history.push(`/order/${order._id}`)
        }
        // eslint-disable-next-line
    }, [history, success])

    const placeOrderHandler = () => {
        
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            earnPoint: Math.round(cart.itemSubTotal * ORDER_EARN_POINT),
            shippingPrice: cart.shippingPrice,
            //need to rework
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            applyPoint: applyPoint,
            promoCode: promo? PROMO_CODE : 'NA',
            promoAmount: promoAmount
        }))
    }

    const applyPromoteCode = (e) => {
        //13 charCode is ENTER key
        if (e.charCode === 13) { 
            
            if (e.target.value === PROMO_CODE) {
               const applyAmount = cart.itemsPrice * PROMO_DISCOUNT_RATE
               // cart.itemSubTotal = cart.itemSubTotal - applyAmount
               // cart.taxPrice = addDecimals(Number((0.12 * cart.itemSubTotal).toFixed(2)))
               // cart.shippingPrice = addDecimals(cart.itemsSubTotal > 100 ? 0 : 5.99)
               // cart.totalPrice = Number(cart.itemSubTotal + Number(cart.shippingPrice) +
                       // Number(cart.taxPrice)).toFixed(2)

                setPromoMessage(false)
                setApplyPoint(0)
                setPromo(true)
                setPromoAmount(applyAmount)
                
                
                
            } else { setPromoMessage(true)}
        }
    }

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4/>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {cart.shippingAddress.address},{' '}
                                {cart.shippingAddress.city},{' '}
                                {cart.shippingAddress.state},{' '}
                                {cart.shippingAddress.postalCode},{' '}
                                {cart.shippingAddress.country} 
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? <message>
                                Your cart is empty
                            </message> : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name}
                                                    fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to= {`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                                
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>

                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                                                    <Card>
                                                        <ListGroup variant='flush'>
                                                            <ListGroup.Item>
                                                                <h2>Order Summary</h2>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Items</Col>
                                                                    <Col>${cart.itemsPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                {!promo? (<>
                                                                <Row>
                                                                    <Col>Apply My Point</Col>
                                                                    <Col>
                                                                    <Form.Control
                                                                            as= 'select'
                                                                            value = { applyPoint }
                                                                            onChange = {
                                                                            (e) => {setApplyPoint(e.target.value)}
                                                                            }
                                        >                               {/*userInfo.totalPoint + 1 for 0 */}
                                                                        {[...Array(userInfo.totalPoint+ 1).keys()].map(
                                                                        (x) => (
                                                                        <option key={x} value={x}>
                                                                        {x}
                                                                        </option>

                                                                        ))}
                                                                    </Form.Control>
                                                                    </Col>
                                                                </Row> </>) : (
                                                                    <Row>
                                                                        <Message>Apply point is not allow while using promote discount!</Message>
                                                                    </Row>
                                                                )
                                                                }
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    
                                                                    
                                                                    {promo ? (<><Col>Promote Amount</Col>
                                                                            <Col>
                                                                            <Form.Control
                                                                            asize='sm' plantext readOnly
                                                                            value = {promoAmount}
                                                                            onChange = {
                                                                            (e) => {}
                                                                            }
                                                                            >
                                                                            </Form.Control>
                                                                            </Col> </>) : 
                                                                            (<><Col>Apply Promote Code</Col>
                                                                            <Col><Form.Control
                                                                            asize='sm' type='text' placeholder='Promo Code'
                                                                            onKeyPress={(e) => {applyPromoteCode(e)}}
                                                                            
                                                                            >
                                                                            </Form.Control>
                                                                            </Col>
                                                                            </>
                                                                            
                                                                            )}
                                                                    
                                                                   
                                                                </Row>
                                                                {promoMessage && <Message>invalid Promote code</Message>}
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Items Sub Total</Col>
                                                                    <Col>${cart.itemSubTotal}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Shipping</Col>
                                                                    <Col>${cart.shippingPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Tax</Col>
                                                                    <Col>${cart.taxPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Total</Col>
                                                                    <Col>${cart.totalPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                {error && <Message variant='danger'>{error}</Message>}
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Button type='button' className='btn-block'
                                                                disabled={cart.cartItems === 0} onClick={placeOrderHandler} >
                                                                    Place Order
                                                                </Button>
                                                            </ListGroup.Item>
                                                        </ListGroup>
                                                    </Card>
                                                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen
