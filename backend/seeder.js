import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()

await connectDB()

const importData = async () => {
    try {
        console.log('delete existing data...')
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        console.log('delete existing data completed')

        const createUser = await User.insertMany(users)
        console.log('createUser completed')
        console.log('createUser[0] ='+createUser[0])
        const adminUser = createUser[0]._id
        console.log('adminUser completed')
        const sampleProducts = products.map(product =>{
            return {
                ...product, user: adminUser
            }
        })

        await Product.insertMany(sampleProducts)

        console.log('Data import completed'.green.inverse)

        process.exit()



    } catch(error){

        console.error(`${error}`)
        process.exit(1)

    }

}

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Destroy completed'.red.inverse)

        process.exit()



    } catch(error){

        console.error(`${error}`.red.inverse)
        process.exit(1)

    }

}

if (process.argv[2] === '-d'){
    destroyData()
} else {
    importData()
}