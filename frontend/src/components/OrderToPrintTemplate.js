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
          {this.props.table !== 'NA' && (<tr><th></th><th>Table:</th><th>{this.props.table}</th></tr>) }
          {this.props.pickupPerson  !== 'NA' && (<tr><th></th><th>Pickup Name:</th><th>{this.props.pickupPerson}</th></tr>)}

          <tr>
          <th width="10%">SEQ</th>
          <th width="70%">item name</th>
          <th width="20%">qty</th>
          </tr>
        </thead>
        <tbody>
        {this.props.orderItems && this.props.orderItems.map((item, index) => (
          <>
          <tr>
            <td width="10%">{index +1}</td>
            <td width="80%">{item.name}</td>
            <td width="10%">{item.qty}</td>
          </tr>
          <tr>
            <td width="20%">special Req</td>
            <td width="60%">{item.specialReq}</td>
          </tr>
          </>
        ))}
        </tbody>
      </table> 
        </>
    )
}}


