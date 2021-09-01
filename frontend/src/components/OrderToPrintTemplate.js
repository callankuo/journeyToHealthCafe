import React from 'react'

export class OrderToPrintTemplate extends React.PureComponent{
  render() {

    return (
        <>
      
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


