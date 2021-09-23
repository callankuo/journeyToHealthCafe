import mongoose from 'mongoose'

const userPointSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'

        },
        type: {
            type: String,
            required: true,
            default: 'grant'
         },
        transactionAt: {
            type: Date,
            required: true
         },
        transaction: {
            franchise: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Franchise'
             },
             points: {
                type: Number,
                required: true,
                default: 0
             },
             
        },
        totalGrantPoint: {
            type: Number,
            required: true,
            default: 0
         },
         totalRedemptionPoint: {
            type: Number,
            required: true,
            default: 0
         },
        balancePoint: {
            type: Number,
            required: true,
            default: 0
         },
    }, {
        timestampes: true
    }
)

const UserPoint = mongoose.model('UserPoint', userPointSchema)

export default UserPoint