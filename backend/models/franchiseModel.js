import mongoose from 'mongoose'

const franchiseSchema = mongoose.Schema(
    {
       franchiseName: {
        type: String,
        required: true,
        },
        storeName: {
            type: String,
            required: true,
        },
        address: {
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
    }, {
        timestampes: true
    }
)

const Franchise = mongoose.model('Franchise', franchiseSchema)

export default Franchise