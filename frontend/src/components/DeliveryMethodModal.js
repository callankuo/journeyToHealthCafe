import React, {useState, useEffect} from 'react'
import {Modal, Form, Button, Col} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { saveDeliverytMethod } from '../actions/cartActions'
import {useDispatch} from 'react-redux'




const DeliveryMethodModal = (props) => {

    const dispatch = useDispatch()

    const [method, setMethod] = useState(props.table ? 'dineIn' : '')

    useEffect( () => {
        
        const deliveryMethod = {method: method, agent: props.table? props.table : ''}
        dispatch(saveDeliverytMethod(deliveryMethod))
        // eslint-disable-next-line
    } , [dispatch, method]
    
    )
    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            How you want food to deliver today?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <FormContainer>
            <Form>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                <Col>
                    <Form.Check type='radio' label='Dine In' 
                    id='DineIn' name='method' value='dineIn' 
                    defaultChecked = {method === 'dineIn'}
                    onChange={(e) => setMethod(e.target.value)}></Form.Check>
                
                    <Form.Check type='radio' label='Pickup' 
                    id='Pickup' name='method' value='pickup'
                    defaultChecked = {method === 'pickup'}
                    onChange={(e) => setMethod(e.target.value)}></Form.Check>

                    <Form.Check type='radio' label='Delivery' 
                    id='Dilivery' name='method' value='delivery'
                    defaultChecked = {method === 'delivery'}
                    onChange={(e) => setMethod(e.target.value)}></Form.Check>
                    
                </Col>
                </Form.Group>

                
            </Form>
        </FormContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>OKay</Button>
        </Modal.Footer>
      </Modal>
    )
}

export default DeliveryMethodModal
