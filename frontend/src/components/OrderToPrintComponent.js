import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import {Button} from 'react-bootstrap'

import {OrderToPrintTemplate} from './OrderToPrintTemplate'

const OrderToPrintComponent = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  return (
    <div>
      <OrderToPrintTemplate ref={componentRef} 
        order = {props.order}
      />
      <Button type='button' className='btn btn-block' onClick={handlePrint}>Print Receive</Button>
    </div>
  )
}

export default OrderToPrintComponent