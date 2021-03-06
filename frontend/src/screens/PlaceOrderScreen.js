import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Button, Row, Col, ListGroup, Image, Card, Form} from 'react-bootstrap'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder, getOrderDetails } from '../actions/orderActions'
import { ORDER_EARN_POINT, POINT_DOLLAR_RATE, PROMO_CODE, PROMO_DISCOUNT_RATE, STORE_FRANCHISE_ID} from '../constants/configConstants'
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
    const [tipPrice, setTipPrice] = useState(Number(cart.itemsPrice * 0.2).toFixed(2))
    cart.itemSubTotal = Number(cart.itemsPrice - promoAmount - (applyPoint * POINT_DOLLAR_RATE)).toFixed(2)
    cart.shippingPrice = addDecimals(cart.deliveryMethod === 'delivery' ? 5.99 : 0)
    cart.taxPrice = addDecimals(Number((0.12 * cart.itemSubTotal).toFixed(2)))
    cart.totalPrice = Number(Number(cart.itemSubTotal) + Number(cart.shippingPrice) +
                        Number(cart.taxPrice) + Number(tipPrice)).toFixed(2)


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
            franchise: STORE_FRANCHISE_ID,
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            earnPoint: Math.round(cart.itemSubTotal * ORDER_EARN_POINT),
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            tipPrice: tipPrice,
            totalPrice: cart.totalPrice,
            applyPoint: applyPoint,
            promoCode: promo? PROMO_CODE : 'NA',
            promoAmount: promoAmount,
            //delivery method deconstruction
            deliveryMethod: cart.deliveryMethod.method?cart.deliveryMethod.method : 'NA' ,
            table: cart.deliveryMethod.method === 'dineIn' ? cart.deliveryMethod.agent : 'NA',
            pickupPerson: cart.deliveryMethod.method === 'pickup' ? cart.deliveryMethod.agent : 'NA'

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
                            <h2>Delivery Method</h2>
                            <p>
                                <strong>Method: </strong>{cart.deliveryMethod.method}
                            </p>
                            {cart.deliveryMethod.method === 'dineIn' && (
                                <p>
                                <strong>Dine In at Table: {cart.deliveryMethod.agent} </strong>
                                
                                </p>
                            )}
                            {cart.deliveryMethod.method === 'pickup' && (
                                <p>
                                <strong>Pick up person name: {cart.deliveryMethod.agent} </strong>
                                
                                </p>
                            )}

                            {cart.deliveryMethod.method === 'delivery' && (
                               
                            

                            <p>
                                <strong>Delivery To Address: </strong>
                                {cart.shippingAddress.address},{' '}
                                {cart.shippingAddress.city},{' '}
                                {cart.shippingAddress.state},{' '}
                                {cart.shippingAddress.postalCode},{' '}
                                {cart.shippingAddress.country} 
                            </p>
                            )}
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
                                                <Col md={7}>
                                                    <Link to= {`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                                
                                            </Row>
                                            <Row>
                                            <Col md={3}><p>Special Request:</p></Col>
                                    <Col md={9}>
                                        {item.specialReq}
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
                                                                    <Col>Items Price</Col>
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
                                                                <>
                                                                <Row>
                                                                    <Col>Gratitude</Col>
                                                                    <Col>
                                                                    <Form.Control
                                                                            as= 'select'
                                                                            value = { tipPrice }
                                                                            onChange = {
                                                                            (e) => {setTipPrice(e.target.value)}
                                                                            }
                                        >                               {/* [15%, 20%, 30%, 40%, 50%, 100%, None] */}
                                                                        {[Number(cart.itemsPrice * 0.2).toFixed(2),Number(cart.itemsPrice * 0.1).toFixed(2),
                                                                        Number(cart.itemsPrice * 0.3).toFixed(2), Number(cart.itemsPrice * 0.4).toFixed(2),
                                                                        Number(cart.itemsPrice * 0.5).toFixed(2), 0.00].map(
                                                                        (x, index) => (
                                                                        <option key={index + 1} value={x}>
                                                                        {index === 0 ? '20%' : index === 1 ? '10%' : index < 5 ? (index+1)*10 + '%' : 'None'}
                                                                        </option>

                                                                        ))}
                                                                    </Form.Control>
                                                                    </Col>
                                                                </Row> 
                                                                <Row>
                                                                    <Col>Tip Amount</Col>
                                                                    <Col>${tipPrice}</Col>
                                                                </Row>
                                                                
                                                                </>
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
