import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, ListGroup, Image, Card, Button} from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, payCashOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET, ORDER_CREATE_RESET, ORDER_PAY_CASH_RESET} from '../constants/orderConstants'
import { POINT_DOLLAR_RATE, STORE_FRANCHISE_ID } from '../constants/configConstants'
import { cartReset } from '../actions/cartActions'
import { pointRegister, updateUser } from '../actions/userActions'
import {OrderToPrintTemplate} from '../components/OrderToPrintTemplate'
import OrderToPrintComponent from '../components/OrderToPrintComponent'
import { USER_POINT_REGISTER_RESET } from '../constants/userConstants'
const OrderScreen = ({match, history}) => {
    const orderId = match.params.id

    const [sdkReady, setSdkReady] = useState(false)
    
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails) 
    const { order, loading, error } = orderDetails
    
    //const orderCreate = useSelector(state => state.orderCreate) 
    //const { order, loading, error } = orderCreate

    const orderPay = useSelector(state => state.orderPay) 
    const {loading:loadingPay, success:successPay} = orderPay

    const orderPayCash = useSelector(state => state.orderPayCash) 
    const {loading:loadingPayCash, success:successPayCash} = orderPayCash

    const orderDeliver = useSelector(state => state.orderDeliver) 
    const {loading:loadingDeliver, success:successDeliver} = orderDeliver

    const userLogin = useSelector(state => state.userLogin) 
    const { userInfo } = userLogin

    if (!loading && order) {
    //calculate price 
    const addDecimals = (num) => {
        return (Math.round(num *100) /100).toFixed(2)
    }
    order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    order.itemSubTotal = Number(order.itemsPrice - order.promoAmount - (order.applyPoint * POINT_DOLLAR_RATE)).toFixed(2)
    }
    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }
        const addPayPalScript = async () => {

            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            
            script.onload = () =>  {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }
        
        if (!order || successPay ||  successPayCash || successDeliver) {
            //update user total point by adding new pay order earnPoint
            if (successPay || successPayCash) {
                userInfo.totalPoint = userInfo.totalPoint + order.earnPoint - order.applyPoint
                dispatch(updateUser(userInfo))
                if (order.earnPoint - order.applyPoint > 0) dispatch(pointRegister(STORE_FRANCHISE_ID, 'grant', userInfo._id, order.earnPoint - order.applyPoint))
                if (order.earnPoint - order.applyPoint < 0) dispatch(pointRegister(STORE_FRANCHISE_ID, 'redemption', userInfo._id, order.applyPoint - order.earnPoint))

            }
        dispatch(cartReset()) 
        dispatch({ type: ORDER_PAY_RESET})
        dispatch({ type: ORDER_PAY_CASH_RESET})
        dispatch({ type: ORDER_DELIVER_RESET})
        dispatch({ type: ORDER_CREATE_RESET})
        dispatch({ type: USER_POINT_REGISTER_RESET})
        dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        } 
    }, [dispatch, history, userInfo, orderId, successPay, successPayCash, order, successDeliver])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }
    
    const cashPaymentHandler = () => {
     
        dispatch(payCashOrder(orderId))
    } 

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    return loading? <Loader /> : error? <Message variant='danger'>{error}</Message>
        : !order?<Message variant='danger'>{'Logging off ...'}</Message> : <>
        <h1>Order {order._id}</h1>
        <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Delivery Method</h2>
                            <p>
                                <strong>Method: </strong>{order.deliveryMethod}
                            </p>
                            <p>
                                <strong>Name: </strong>{order.user.name}
                            </p>
                            <p> <strong>Email: </strong>
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            {order.deliveryMethod === 'dineIn' && (
                                <p>
                                <strong>Dine In at Table: {order.table} </strong>
                                
                                </p>
                            )}
                            {order.deliveryMethod === 'pickup' && (
                                <p>
                                <strong>Pick up person name: {order.pickupPerson} </strong>
                                
                                </p>
                            )}

                            {order.deliveryMethod === 'delivery' && (
                               
                            

                            <p>
                                <strong>Delivery To Address: </strong>
                                {order.shippingAddress.address},{' '}
                                {order.shippingAddress.city},{' '}
                                {order.shippingAddress.state},{' '}
                                {order.shippingAddress.postalCode},{' '}
                                {order.shippingAddress.country} 
                            </p>
                            )}
                        {order.isDelivered ? (
                                <Message variant='success'>
                                    Delivered on {order.deliveredAt}
                                </Message>
                        ) : (
                                <Message variant='danger'>Not Delivered</Message>
                        )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                            </p>
                            {
                                order.isPaid?(<Message variant='success'>Paid at {order.paidAt}</Message>)
                                : (<Message variant='danger'>Not Paid</Message>)
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <message>
                                Order is empty
                            </message> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
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
                                                                    <Col>${order.itemsPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Apply My Point</Col>
                                                                    <Col>- ${Number(order.applyPoint * POINT_DOLLAR_RATE).toFixed(2)}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Promo Amount</Col>
                                                                    <Col>- ${order.promoAmount}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Item Sub Total</Col>
                                                                    <Col>${order.itemSubTotal}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Shipping</Col>
                                                                    <Col>${order.shippingPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Tax</Col>
                                                                    <Col>${order.taxPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Tip Amount</Col>
                                                                    <Col>${order.tipPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Total</Col>
                                                                    <Col>${order.totalPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                        {(!order.isPaid && order.paymentMethod === 'PayPal') && (
                                                            <ListGroup.Item>
                                                                {loadingPay && <Loader />}
                                                                {!sdkReady? <Loader /> :
                                                                (
                                                                    <PayPalButton amount={order.totalPrice} 
                                                                    onSuccess={successPaymentHandler} />
                                                                )
                                                                }
                                                            </ListGroup.Item>                                  
                                                        )
                                                        }   
                                                        {(!order.isPaid && order.paymentMethod === 'Cash') &&        
                                                        (
                                                            <ListGroup.Item>
                                                                 {loadingPayCash && <Loader />}
                                                               <Button type='button' className='btn btn-block' onClick={cashPaymentHandler}>
                                                                    Cash amount {order.totalPrice} received by {userInfo.name}
                                                                </Button>
                                                            </ListGroup.Item>                                  
                                                        )}

                                                        {loadingDeliver && <Loader />}
                                                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                                            <> { console.log('orderItemslength =' + order.orderItems.length)}
                                                               {order.orderItems.length > 0 && ( 
                                                                <ListGroup.Item>
                                                                    
                                                                    <OrderToPrintComponent 
                                                                        order = {order}
                                                                    />

                                                                    

                                                                </ListGroup.Item>
                                                               )}
                                                            <ListGroup.Item>
                                                                <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                                                    Mark As Delivered
                                                                </Button>
                                                            </ListGroup.Item>
                                                            </>
                                                        )}
                                                        </ListGroup>
                                                    </Card>
                                                </Col>
            </Row>
        </>
}

export default OrderScreen
