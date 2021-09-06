import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
    {   franchise: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Franchise'

        },
        
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        //this regex works for the formats (123) 456-7890 or 123-456-7890 for Example.
        phone: {
            type: String,
            match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        totalPoint: {
            type: Number,
            required: true,
            default: 0
        },
    }, {
        timestampes: true
    } 
)

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)


})
const User = mongoose.model('User', userSchema)

export default User