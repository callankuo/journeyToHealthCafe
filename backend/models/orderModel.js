import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
    {   franchise: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Franchise'

    },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'

        },
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
        paymentMethod: {
            type: String,
            required: true
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String }
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0
        },
        promoCode: {
            type: String,
            required: true,
            default: 'NA'
        },
        promoAmount: {
            type: Number,
            required: true,
            default: 0.0
        },
        applyPoint: {
            type: Number,
            required: true,
            default: 0
        },

        totalPrice: {
            type: Number,
            required: true,
            default: 0.0
        },
        earnPoint: {
            type: Number,
            required: true,
            default: 0
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false
        },
        paidAt: { type: Date},
        isDelivered: {
            type: Boolean,
            required: true,
            default: false
        },
        deliveredAt: { type: Date},
        createdAt: { type: Date},


    }, {
        timestampes: true
    }
)

const Order = mongoose.model('Order', orderSchema)

export default Order