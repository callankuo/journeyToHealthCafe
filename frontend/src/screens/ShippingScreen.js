import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress, saveDeliverytMethod} from '../actions/cartActions'
import { STORE_ADDRESS, STORE_CITY, STORE_STATE, STORE_POSTALCODE, STORE_COUNTRY} from '../constants/configConstants'


const ShippingScreen = ({ history }) => {

    const cart = useSelector(state => state.cart)
    const { shippingAddress, deliveryMethod } = cart

    const [table, setTable] = useState(deliveryMethod && deliveryMethod.method === 'dineIn' ? deliveryMethod.agent:'')
    const [pickupName, setPickupName] = useState('')

    const [address, setAddress] = useState(shippingAddress? shippingAddress.address :'') 
    const [city, setCity] = useState(shippingAddress? shippingAddress.city : '') 
    const [state, setState] = useState(shippingAddress?shippingAddress.state: '') 
    const [postalCode, setPostalCode] = useState(shippingAddress?shippingAddress.postalCode:'') 
    const [country, setCountry] = useState(shippingAddress?shippingAddress.country:'') 

    const dispatch = useDispatch()

    const submitHandler = (e) => {

        e.preventDefault()
        if (deliveryMethod.method === 'delivery') {
            dispatch(saveShippingAddress({address, city, state, postalCode, country}))
        } else if (deliveryMethod.method === 'dineIn') {
            const deliveryMethod =  {method: 'dineIn', agent: table}
            dispatch(saveDeliverytMethod(deliveryMethod))
            dispatch(saveShippingAddress({address: STORE_ADDRESS, city: STORE_CITY, state: STORE_STATE, postalCode: STORE_POSTALCODE, country: STORE_COUNTRY}))
        } else {
            const deliveryMethod =  {method: 'pickup', agent: pickupName}
            dispatch(saveDeliverytMethod(deliveryMethod))
            dispatch(saveShippingAddress({address: STORE_ADDRESS, city: STORE_CITY, state: STORE_STATE, postalCode: STORE_POSTALCODE, country: STORE_COUNTRY}))
        }
        history.push('/payment')
        }

    return (
        
        <FormContainer>
            <CheckoutSteps step1 step2/>
            <h1>Delivery</h1>
            <Form onSubmit={submitHandler}>
            { deliveryMethod.method === 'dineIn' && (
                <>
                <Form.Group controlId='table'>
                    <Form.Label>Dine In Table</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter table'
                        value={table}
                        required
                        onChange={(e) => setTable(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                </>
            )}
            { deliveryMethod.method === 'pickup' && (
                <>
                <Form.Group controlId='pickupName'>
                    <Form.Label>Pickup Person Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Pickup Person Name'
                        value={pickupName}
                        required
                        onChange={(e) => setPickupName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                </>
            )}
            { deliveryMethod.method === 'delivery' && (
                <>
                <Form.Group controlId='address'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter address'
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter city'
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='state'>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter state'
                        value={state}
                        required
                        onChange={(e) => setState(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='postalCode'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter postal code'
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='country'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter country'
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                </>
            )}
            <Button type='submit' variant='primary'>
                    Continue
            </Button>
            </Form>
        </FormContainer>
        
    )
}

export default ShippingScreen
