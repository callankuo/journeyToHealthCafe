import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'

// @desc create new order
// @route POST /api/orders
// @access private
const addOrderItems = asyncHandler(async (req,res) => {
    
    const {
        franchise,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        earnPoint,
        taxPrice,
        shippingPrice,
        totalPrice,
        promoCode,
        promoAmount,
        applyPoint,
        deliveryMethod,
        table,
        pickupPerson

    } = req.body
    console.log('earnPoint='+earnPoint)
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
        return
    } else {
        const order = new Order({
            createdAt: Date.now(),
            franchise,
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            earnPoint,
            taxPrice,
            shippingPrice,
            totalPrice,
            promoCode,
            promoAmount,
            applyPoint,
            deliveryMethod,
            table,
            pickupPerson
        })
        console.log('orderItems size is '+ orderItems.length)
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
    
    

})

// @desc get order by Id
// @route GET /api/orders/:id
// @access private
const getOrderById = asyncHandler(async (req,res) => {
    
   const order = await Order.findById(req.params.id).populate(
       'user', 'name email')
    
    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
    

})

// @desc update order to paid
// @route GET /api/orders/:id/pay
// @access private
const updateOrderToPaid = asyncHandler(async (req,res) => {
    
   const order = await Order.findById(req.params.id)
    
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updateOrder = await order.save()
        res.json(updateOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
    

})

// @desc update order to delivered
// @route GET /api/orders/:id/deliver
// @access private/admin
const updateOrderToDelivered = asyncHandler(async (req,res) => {
    
    const order = await Order.findById(req.params.id)
     
     if (order) {
         order.isDelivered = true
         order.deliveredAt = Date.now()
 
         const updateOrder = await order.save()
         res.json(updateOrder)
     } else {
         res.status(404)
         throw new Error('Order not found')
     }
     
 
 })

// @desc get login user's orders
// @route GET /api/orders/myorders
// @access private
const getMyOrders = asyncHandler(async (req,res) => {
    
    const orders = await Order.find({user: req.user._id})
     
     res.json(orders)
     
 
 })

 // @desc get all orders
// @route GET /api/orders
// @access private/admin
const getOrders = asyncHandler(async (req,res) => {
    
    const orders = await Order.find({}).populate('user', 'id name')
     
     res.json(orders)
     
 
 })

export {addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered}