import axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD, CART_RESET, CART_SAVE_DELIVERY_METHOD } from "../constants/cartConstants";

export const addToCart = (id, qty, specialReq) => async (dispatch, getState) => {
    const {data} = await axios.get(`/api/products/${id}`)

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
                product: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                point: data.point,
                countInStock: data.countInStock,
                qty,
                specialReq

        }

    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    })
    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    })
    localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const saveDeliverytMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_DELIVERY_METHOD,
        payload: data
    })
    localStorage.setItem('deliveryMethod', JSON.stringify(data))
}



export const cartReset = () => (dispatch, getState) => {
    dispatch({
        type: CART_RESET
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    localStorage.setItem('deliveryMethod', JSON.stringify(getState().cart.deliveryMethod))
    //localStorage.removeItem('deliveryMethod')
}