import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {productListReducer, productDetailsReducer, productDeleteReducer, productCreateReducer, productUpdateReducer, productReviewCreateReducer, productTopRatedReducer, categoriesTopReducer} from './reducers/productReducers'
import {cartReducer} from './reducers/cartReducers'
import { userUpdateReducer, userDeleteReducer, userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userPointRegisterReducer } from './reducers/userReducers'
import {orderCreateReducer, orderDetailsReducer, orderPayReducer, orderListMyReducer, orderListReducer, orderDeliverReducer, orderPayCashReducer} from './reducers/orderReducers'

const reducer = combineReducers({productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,
    categoriesTop: categoriesTopReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userPointRegister: userPointRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderPayCash: orderPayCashReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,
})
    
const cartItemsFromStorage = localStorage.getItem('cartItems')?
JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo')?
JSON.parse(localStorage.getItem('userInfo')) : null

const userPointInfoFromStorage = localStorage.getItem('userPointInfo')?
JSON.parse(localStorage.getItem('userPointInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')?
JSON.parse(localStorage.getItem('shippingAddress')) : {}

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')?
JSON.parse(localStorage.getItem('paymentMethod')) : {}

const deliveryMethodFromStorage = localStorage.getItem('deliveryMethod')?
JSON.parse(localStorage.getItem('deliveryMethod')) : {}

const initialState = {
    cart: { cartItems: cartItemsFromStorage,
            shippingAddress: shippingAddressFromStorage,
            paymentMethod: paymentMethodFromStorage,
            deliveryMethod: deliveryMethodFromStorage
    },
    userLogin: {userInfo: userInfoFromStorage},
    userPointRegister : {userPointInfo: userPointInfoFromStorage}
     
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store
