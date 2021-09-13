import mongoose from 'mongoose'

const orderQueueSchema = mongoose.Schema(
    {   
        orderItems: [ {
            name: {
                type: String,
                required: true
            },
            qty: {
                type: Number,
                required: true,
                default: 0
            },
            specialReq: {
                type: String,
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'

            }
            
        } ],
        table: {
            type: String,
            required: true,
            default: 'NA'
        },
        pickupPerson: {
            type: String,
            required: true,
            default: 'NA'
        },
        deliveryMethod: {
            type: String,
            required: true,
            default: 'dineIn'
        },
        shippingAddress: {
            address: {
                type: String,
                required: true
             },
             city: {
                type: String,
                required: true
             },
             postalCode: {
                type: String,
                required: true
             },
             state: {
                type: String,
                required: true
             },
             country: {
                type: String,
                required: true
             }
            
        },
        status: {
            type: String,
            required: true,
            default: 'N'
        },
        createdAt: { type: Date},
        printAt: { type: Date},


    }, {
        timestampes: true
    }
)

const OrderQueue = mongoose.model('OrderQueue', orderQueueSchema)

export default OrderQueue