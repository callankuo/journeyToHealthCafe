import React from 'react'
import { STORE_ADDRESS, STORE_CITY, STORE_NAME, STORE_POSTALCODE, STORE_STATE } from '../constants/configConstants'

export class OrderToPrintTemplate extends React.PureComponent{
  
  render() {
    

    return (
        <>
        <table>
          <thead>
          <tr>
            <th width='100%'><center>{STORE_NAME}</center></th>
          </tr>
          <tr>
            <th width='100%'>{STORE_ADDRESS}, {STORE_CITY}, {STORE_STATE + ' ' +STORE_POSTALCODE}</th>
          </tr>
          <tr>
            <th width='100%'><center>Order Date: {new Date().toLocaleString()}</center></th>
          </tr>
          </thead>
        </table>
      
        <table>
          <thead>
          <tr>
            <th width='10%'></th>
            <th width='70%'>Delivery: </th>
            <th width='20%'>{this.props.deliveryMethod}</th>
          </tr>
          {this.props.order.table !== 'NA' && (<tr><th></th><th>Table:</th><th>{this.props.order.table}</th></tr>) }
          {this.props.order.pickupPerson  !== 'NA' && (<tr><th></th><th>Pickup Name:</th><th>{this.props.order.pickupPerson}</th></tr>)}
          <tr>
          <th width="10%">======</th>
          <th width="70%">====================</th>
          <th width="20%">======</th>
          </tr>
          <tr>
          <th width="10%">Qty</th>
          <th width="70%">item name</th>
          <th width="20%">price</th>
          </tr>
          <tr>
          <th width="10%">======</th>
          <th width="70%">====================</th>
          <th width="20%">======</th>
          </tr>
        </thead>
  
        <tbody>
        {this.props.order.orderItems && this.props.order.orderItems.map((item) => (
          <>
          <tr>
            <td width="10%">{item.qty}</td>
            <td width="80%">{item.name}</td>
            <td width="10%">${item.price}</td>
          </tr>
          </>
        ))}
        <tr>
          <td width="10%">======</td>
          <td width="70%">====================</td>
          <td width="20%">=====</td>
        </tr>
          {this.props.order.applyPoint !== 0 && (<tr><td></td><td>Apply Points:</td><td>{this.props.order.applyPoint}</td></tr>) }
          {this.props.order.promoAmount !== 0 && (<tr><td></td><td>Promo Amount:</td><td>{this.props.order.promoAmount}</td></tr>) }
          {this.props.order.shippingPrice !== 0 && (<tr><td></td><td>Shipping Charge:</td><td>{this.props.order.shippingPrice}</td></tr>) }
          {this.props.order.taxPrice !== 0 && (<tr><td></td><td>Tax:</td><td>{this.props.order.taxPrice}</td></tr>) }
          {this.props.order.tipPrice !== 0 && (<tr><td></td><td>Tip:</td><td>{this.props.order.tipPrice}</td></tr>) }
          <tr><td></td><td>Total:</td><td>{this.props.order.totalPrice}</td></tr>
        </tbody>
      </table> 
      <table>
        <tbody>
        <tr width='100%'><td width='60%'>PaymentMethod</td><td width='40%'>{this.props.order.paymentMethod}</td></tr>
          <tr width='100%'><td width='60%'>Paid at</td><td width='40%'>{this.props.order.paidAt.substring(0,10) + ' '+this.props.order.paidAt.substring(11,19)}</td></tr>
          {this.props.order.paymentMethod === 'PayPal' && (<tr width='100%'><td width='60%'>Transaction Id</td><td width='40%'>{this.props.order.paymentResult.id}</td></tr>) }
        </tbody>

      </table>
        </>
    )
}}


