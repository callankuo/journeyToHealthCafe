import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import {Button} from 'react-bootstrap'

import {OrderToPrintTemplate} from './OrderToPrintTemplate'

const OrderToPrintComponent = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
    console.log('props '+props.deliveryMethod)
  return (
    <div>
      <OrderToPrintTemplate ref={componentRef} 
        orderItems = {props.orderItems}
        deliveryMethod = {props.deliveryMethod}
        table = {props.table}      
        pickupPerson = {props.pickupPerson}  
      />
      <Button type='button' className='btn btn-block' onClick={handlePrint}>Print order to service desk!</Button>
    </div>
  )
}

export default OrderToPrintComponent