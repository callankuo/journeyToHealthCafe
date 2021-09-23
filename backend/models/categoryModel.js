import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const franchise = process.env.STORE_FRANCHISE_ID
const categorySchema = mongoose.Schema(
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
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
            default: 'NA'

        },
        parentCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
            default: franchise
        },
        level: {
            type: Number,
            required: true,
            default: 1

        }, 
        description: {
            type: String,
            required: true,
            default: 'NA'
        },
        
    }, {
        timestampes: true
    }
)

const Category = mongoose.model('Category', categorySchema)

export default Category