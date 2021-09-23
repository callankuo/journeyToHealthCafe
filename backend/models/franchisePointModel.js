import mongoose from 'mongoose'

const franchisePointSchema = mongoose.Schema(
    {
        franchiseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Franchise'

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
             user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
    
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

const FranchisePoint = mongoose.model('FranchisePoint', franchisePointSchema)

export default FranchisePoint